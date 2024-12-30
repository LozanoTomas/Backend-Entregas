export const validateFilePathAndName = (filepath, filename)=>{
    if (!filepath) throw new Error(`La ruta del archivo ${filepath} no fue proporcionada.`);
    if (!filename) throw new Error(`El nombre del archivo ${filename} no fue proporcionado.`);
};