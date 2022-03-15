var fromBtn = document.querySelectorAll(".fromBtn") ;
var downloadForm = document.querySelector(".downloadForm")
var back = document.querySelector(".back")

var submit = document.querySelector(".submit")
var thanksCard = document.querySelector(".thanksCard")
var mask = document.querySelector(".mask")

//表單的check跟對應的文字
var textBtn = document.querySelectorAll('.group p')
var checkBox = document.querySelectorAll('.group .checkBoxArea') 


back.onclick = function(){        
    backWeb()
    
} ;

submit.onclick = function(){
    submitForm()
    
};

thanksCard.onclick = function(){
    backWeb()
    
}

function download(){
    downloadForm.classList.add("active")
};

function backWeb(){
    downloadForm.classList.remove("active")
    thanksCard.classList.remove("active")
    mask.classList.remove("active")
};

function submitForm(){
    downloadForm.classList.remove("active")
    thanksCard.classList.add("active")
};

$('.mask').click(function()
{
    this.classList.remove("active")
    downloadForm.classList.remove("active")
    thanksCard.classList.remove("active")
})







for (let i = 0; i < fromBtn.length; i++) {
    const fromBtnS = fromBtn[i];

    fromBtnS.onclick = function() {

        download() ;
        mask.classList.add("active")
    }
    
};


for (let i = 0; i < textBtn.length; i++) {

    textBtn[i].onclick = function(){
        checkBox[i].click(); 
    }

}