import config from '../config.json'

export default (picture) => {
    return (`${config.URL_GLPI_API.split("apirest.php")[0]}front/document.send.php?file=_pictures/${picture}`)
}