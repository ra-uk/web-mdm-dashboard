export default (data, specialReturn) => {

    let value

    if (!data && (specialReturn || specialReturn === '')) value = specialReturn
    else if (!data && data !== 0) value = "not available"
    else value = data

    if (Array.isArray(value)) return value
    return value.toString()
}