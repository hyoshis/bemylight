import json
import logging
import os

import azure.functions as func
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)


def json_response(body: dict, status_code: int) -> func.HttpResponse:
    return func.HttpResponse(
        json.dumps(body),
        status_code=status_code,
        mimetype="application/json",
    )


@app.route(route="organize-tasks", methods=["POST"])
def organize_tasks(req: func.HttpRequest) -> func.HttpResponse:
    try:
        body = req.get_json()
    except ValueError:
        return json_response({"error": "Send a valid JSON request."}, 400)

    text = body.get("text")
    if not isinstance(text, str) or not text.strip():
        return json_response({"error": "Describe what you need to get done."}, 400)

    text = text.strip()
    if len(text) > 5000:
        return json_response({"error": "Keep your request under 5,000 characters."}, 400)

    try:
        project = AIProjectClient(
            endpoint=os.environ["PROJECT_ENDPOINT"],
            credential=DefaultAzureCredential(),
        )
        with project.get_openai_client() as openai_client:
            response = openai_client.responses.create(
                model=os.environ["MODEL_DEPLOYMENT_NAME"],
                input=text,
                extra_body={
                    "agent": {
                        "name": os.environ["AGENT_NAME"],
                        "type": "agent_reference",
                    }
                },
            )

        result_text = response.output_text.strip()
        if result_text.startswith("```"):
            result_text = result_text.strip("`")
            if result_text.startswith("json"):
                result_text = result_text[4:].strip()

        result = json.loads(result_text)
        tasks = result.get("tasks")
        if not isinstance(tasks, list):
            raise ValueError("Agent response did not include a task list.")

        result["tasks"] = tasks[:12]
        return json_response(result, 200)
    except (KeyError, json.JSONDecodeError, ValueError) as error:
        logging.exception("The task agent returned an invalid response.")
        return json_response({"error": str(error)}, 502)
    except Exception:
        logging.exception("The task agent request failed.")
        return json_response(
            {"error": "The task organizer is unavailable. Try again shortly."},
            502,
        )
