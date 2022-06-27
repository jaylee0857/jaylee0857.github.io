$('.next-btn').click(function(){
    if($('.checkbox-container input').prop('checked') != true){
        $('.text').css('border-bottom','1px solid red')
        $('.checkbox-container .checkmark').css('border','2px solid red')
        $('.checkbox-container .checkmark').focus()
        return false;
    }
})