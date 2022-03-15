var cards_content = document.querySelectorAll('.test') //抓取指定段落div的class
var cards_content_text = [] //儲存字串的空陣列

//預先儲存指定class中所有標籤與文字內容
cards_content.forEach(function(card_content){
    content = card_content.innerHTML
    while(content.indexOf(" ")>=0){content=content.replace(" ","");}
    console.log(content)
    cards_content_text.push(content)
})

//載入先判斷螢幕大小是否需要隱藏,若大於1200則照原先樣式(不隱藏)
if($(window).width() < 1200){
    cards_content.forEach(function(card_content){
        if(card_content.innerHTML.length >= 55){
            card_content.innerHTML = card_content.innerHTML.slice(0,55)+'...'
        }
    })
}

//當畫面縮放時偵測是否小於1200
$(window).resize(function(){
    if($(window).width() < 1200){
        cards_content.forEach(function(card_content){
            // 若length小於指定數字(55)則擷取指定位置(slice(0,55))加上'...'
            if(card_content.innerHTML.length >= 55){
                card_content.innerHTML = card_content.innerHTML.slice(0,55)+'...'
                }
            })
        }else{
        cards_content.forEach(function(card_content,index){
            // 若length大於則回去抓取預先儲存的結構放回class中
            card_content.innerHTML = cards_content_text[index]
            
        })
    }
})