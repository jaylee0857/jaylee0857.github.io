const imgs = document.querySelectorAll('.panorama-area img')
const ponama = document.querySelector('.panorama-area')
let isDown = false
let startX
let startY
let l = 0
//紀錄現在是第幾張圖
let nowPic = 0
//紀錄Y的軌跡
let trackY
let countA = 0
let countB = 0

// 要確認data-series:0水平,1四十五度
let series = 0

function isMobile() {
  try { document.createEvent("TouchEvent"); return true; }
  catch (e) { return false; }
}

//藏圖&首圖
imgs.forEach((img) => {
  if (img.dataset.id == 1 && img.dataset.series == 0) {
    img.classList.remove('hide')
  }
})

//判斷手機還是PC
if (isMobile()) {
  console.log('mob')
  console.dir();
  ponama.addEventListener('touchstart', (e) => {
    isDown = true
    startX = e.touches[0].pageX - ponama.offsetLeft
    startY = e.touches[0].pageY - ponama.offsetTop
    e.preventDefault()
  })

  ponama.addEventListener('touchend', () => {
    isDown = false
    nowPic = l
  })

  ponama.addEventListener('touchcancel', () => {
    isDown = false
    nowPic = l
    
  })

  ponama.addEventListener('touchmove', (e) => {
    if (!isDown) return
    e.preventDefault
    const x = e.touches[0].pageX - ponama.offsetLeft
    const y = e.touches[0].pageY - ponama.offsetTop
    const walkX = (x - startX)
    // const walkY = (y - startY)
    // console.log(y,walkY);

    //如果滑動超出圖片上方
    if(y <= 0){
      isDown = false
    }
    
    //如果滑動超出圖片下方
    if(y >= ponama.offsetHeight){
      isDown = false
    }
    
    if (y < trackY) {
      countA++
      countB = 0
      if (countA > 10) {
        series = 0
        countA = 0
        countB = 0
      }

    } else if (y > trackY) {
      countB++
      countA = 0
      if (countB > 10) {
        series = 1
        countA = 0
        countB = 0
      }
    }

    // console.log(countA,countB);
    trackY = y

    // console.log(x,y);
    l = parseInt(-walkX / 15) + nowPic;
    if (l > 0) {
      l = l % 18;
    } else {
      l = (l + -18 * (Math.floor(l / 18)));
    }



    imgs.forEach((img) => {
      if (img.dataset.id == l && img.dataset.series == series) {
        img.classList.remove('hide')
      } else {
        img.classList.add('hide')
      }
    })
    
  })
  
} else {
  console.log('pc')

  ponama.addEventListener('mousedown', (e) => {
    isDown = true
    ponama.classList.add('active')
    startX = e.pageX - ponama.offsetLeft
    startY = e.pageY - ponama.offsetTop

  })

  ponama.addEventListener('mouseup', () => {
    isDown = false
    ponama.classList.remove('active')
    nowPic = l
  })

  ponama.addEventListener('mouseleave', () => {
    isDown = false
    ponama.classList.remove('active')
    nowPic = l
  })

  ponama.addEventListener('mousemove', (e) => {
    if (!isDown) return
    const x = e.pageX - ponama.offsetLeft
    const y = e.pageY - ponama.offsetTop
    const walkX = (x - startX)
    // const walkY = (y - startY)
    // console.log(y,walkY);

    if (y < trackY) {
      countA++
      countB = 0
      if (countA > 10) {
        series = 0
        countA = 0
        countB = 0
      }

    } else if (y > trackY) {
      countB++
      countA = 0
      if (countB > 10) {
        series = 1
        countA = 0
        countB = 0
      }
    }
    trackY = y

    // console.log(countA, countB);

    l = parseInt(-walkX / 15) + nowPic;
    if (l > 0) {
      l = l % 18;
    } else {
      l = (l + -18 * (Math.floor(l / 18)));
    }



    imgs.forEach((img) => {
      if (img.dataset.id == l && img.dataset.series == series) {
        img.classList.remove('hide')
      } else {
        img.classList.add('hide')
      }
    })
    // console.log(l);
  })
}