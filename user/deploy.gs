function deploy() {
  const filesToCopy = ["lib_common", "lib_main", "lib_sett", "lib_types"];

  for (let file of filesToCopy) {
    const res = ScriptSync.IO_AddNewFile(file); 
    if (!res) break;
  }
}
