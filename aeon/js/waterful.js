const newsCards = document.querySelectorAll('.news-card')
const showMoreBtn = document.querySelector('.show-more')
//畫面一開始要幾筆
let count
let num = 0
let windowWidth

//檢查畫面大小
windowWidth = window.innerWidth

//大於1140,初始化先秀出幾張卡片
if(windowWidth > 768){
    count = 6
}else {
    count = 3
}


//init
newsCards.forEach((card)=>{
    //看要秀幾張,後面都藏起來
    if(card.dataset.id <= count){
        card.classList.add('show')
    }else{
        card.classList.add('hide-card')
    }
})

//click
showMoreBtn.addEventListener('click',()=>{
    //更改出卡片數,ex每次點擊出6筆
    count += 6
    newsCards.forEach((card)=>{
        //包含hide-card並且小於等於要出的卡片數,就放出來
        if(card.classList.contains('hide-card') && card.dataset.id <= count){
            card.classList.remove('hide-card')
            card.classList.add('show')
        }
        //無資料時關閉按鈕
        if(count >= newsCards.length){
            showMoreBtn.classList.add('hide-card')
        }
    })
})