export default matchesSelector = (element,selector)=>{ //检测element是否能被querySelector或querySelectorAll中返回
    if(element.matchesSelector){
        return element.matchesSelector(selector);
    }else if(element.msMatchesSelector){
        return element.msMatchesSelector(selector);
    }else if(element.mozMatchesSelector){
        return element.mozMatchesSelector(selector);
    }else if(element.webkitMatchesSelector){
        return element.webkitMatchesSelector(selector);
    }else{
        throw new Error("not supported");
    }
}

export default deleteClass = (element, class_name) => {
    element = document.getElementById(element);
    let classNames = element.className.split(/\s+/);
    let pos = -1,
        i,
        len;
    for(i = 0,len = classNames.length; i < len; i++){
        if(classNames[i] == class_name){
            pos = i;
            break;
        }
    }
    classNames.splice(pos,1);
    element.className = classNames.join(" ");
    return classNames.join(" ");
    //等价于 element.classList.remove(class_name);   classList方法：add、contains、remove、toggle
}

export default documentMode = () => {
    return document.compatMode == "CSS1Compat" ? "Standards mode" : "Quirks mode";
}

export default documentHead = () => {
    return document.head || document.getElementsByTagName("head")[0];
}

export default datasetProps = (element, propName) => {
    element = document.getElementById(element);
    //设置   element.dataset.propName = "propValue";
    //判断   if(element.dataset.propName){}
    return element.dataset.propName;//获取
}

export default documentContain = (refNode,otherNode) => {
    if(typeof refNode.contains == "function" && (!clientInformation.engine.webkit || clientInformation.engine.webkit >= 522)){
        return refNode.contains(otherNode);
    }else if(typeof refNode.compareDocumentPostion == "function"){
        return !!(refNode.compareDocumentPostion(otherNode) & 16);
    }else{
        let node = otherNode.parentNode;
        do{
            if(node === refNode){
                return true;
            }else{
                node = node.parentNode;
            }
        }while(node != null);
        return false;
    }
}

export default getInnerText = (element) => {
    element = document.getElementById(element);
    return (typeof element.textContent == "string")?element.textContent:element.innerText;
}

export default setInnerText = (element,text) => {
    element = document.getElementById(element);
    if(typeof element.textContent == "string"){
        element.textContent = text;
    }else{
        element.innerText = text;
    }
}


//把元素的事件代理委托到父层元素上
export default eventDelegate = (parentSeletor,targetSeltor,events,foo) => {
    function triFunction(e){
        var event = e || window.event;
        var target = event.target || event.srcElement;
        var currentTarget = event.currentTarget;
        if(!Element.prototype.matches){
            Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function(s){
                var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                    i = matches.length;
                while(--i >= 0 && matches.item(i) != this){}
                return i > -1;
            }
        }
        while(target !== currentTarget){
            if(target.matches(targetSeltor)){
                var sTarget = target;
                foo.call(sTarget,Array.prototype.slice.call(arguments))
            }
            target = target.parentNode;
        }
    }
}
//eventDelegate('#list', 'li', 'click', function () { console.log(this); });