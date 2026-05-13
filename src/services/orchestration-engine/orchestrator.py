import os, sys, json
from groq import Groq

def orchestrate_task(operation, target_id):
    client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
    data_root = "src/data-layer"
    infrastructure_nodes = ["logic-governance", "reference-data", "initialization-metadata"]
    target_node = f"entities/entity-{target_id:02}"
    context = ""
    for node in infrastructure_nodes + [target_node]:
        manifest_path = os.path.join(data_root, node, "node_manifest.json")
        if os.path.exists(manifest_path):
            with open(manifest_path, "r") as f: context += f.read() + "\n"
    try:
        completion = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {"role": "system", "content": f"AGNOSTIC_ENGINE_CONTEXT: {context}"},
                {"role": "user", "content": f"EXECUTE_OPERATION: {operation} TARGET: {target_id}"}
            ]
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"ORCHESTRATION_FAILURE: {str(e)}"

if __name__ == "__main__":
    print(orchestrate_task("generate", 1))
