export default (data) =>{
    return data.reduce((a, e)=>{a.push({value: e.id, label: e.name}); return a;}, [])
}