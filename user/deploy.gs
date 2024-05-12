function deploy() {
  const script_id = "my_template_script_id";
  const updater = ScriptSync.assignTemplate(script_id);
  const filesToCopy = ["my_code", "my_index", "my_json"];

  for (let file of filesToCopy) {
    updater.AddNewFile(file);
  }
  updater.commit();
}
