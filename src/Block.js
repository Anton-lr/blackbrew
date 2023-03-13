const Block = ({ data, setting, func}) => {
    function render() {
        if (data.type == "key") {
            return (
                <div className={data.type} key={data.id}>
                    <div className="title">{data.name} 🗝 </div>
                    <div className="itemInfo">
                        <div className="description">{data.description}</div>
                        <div className="activate">Hit: {data.activate}</div>
                        <div className="buyoff">Buyoff: {data.buyoff}</div>
                    </div>
                </div>
            )
        }

        if (data.type == "secret") {
            return (
                <div className={data.type} key={data.id}>
                    <div className="title">{data.name}</div>
                    <div className="itemInfo">
                        <div className="description">{data.description}</div>
                        <div className="requires">Requires: {data.requires}</div>
                    </div>
                </div>
            )
        }

        else {
            return (
                <div className={data.type} key={data.id}>
                    <div className="title">{data.name}</div>
                    <div className="itemInfo">
                        <div className="description">{data.description}</div>
                    </div>
                </div>
            )
        }
    }
    /*
 <div className="ui">
                {setting == "discover" && <button className="add" onClick={() => addToSaved(data)}>Add</button>}
                {setting == "saved" && <button className="remove" onClick={() => handleDelete(data.id)}>Remove</button>}
    */

    return (
        <button className="block" onClick={() => func(data)}>
            <div className="info">{render()}</div>
        </button>
    )
}

export default Block;