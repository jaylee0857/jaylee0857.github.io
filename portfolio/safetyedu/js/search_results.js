; (function () {
    // Init



    $(function () {
        var len = 80;
         // 超過80個字以"..."取代
    
        $(".resultstext").each(function (i) {
          $(this).text().trim()
          console.log($(this).text().trim());
          if ($(this).text().length > len) {
    
            // $(this).attr("title", $(this).text());
            var text = $(this).text().trim().substring(0, len - 1) + "...";
            $(this).text(text);
          }
        });
        
      });
  
      function pagenumber() {
        var FPB = document.querySelectorAll(".filter-pagination-bullet")
        var FPBA = document.querySelector('.filter-pagination-bullet.active')
        var FPBB = document.querySelectorAll('.filter-pagination-bullet.activeB')
      
        
        if (FPB.length>=3) {
          console.log(">3");
          if (FPB.length>7 && window.innerWidth >= 768) {
            console.log('>7');
            if(FPB[0].classList.contains('active')){
              FPBA.nextElementSibling.classList.add('activeB');
              FPBA.nextElementSibling.nextElementSibling.classList.add('activeB');
              FPBA.nextElementSibling.nextElementSibling.nextElementSibling.classList.add('activeB');
              FPBA.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.classList.add('activeB');
              FPBA.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.classList.add('activeB');
              FPBA.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.classList.add('activeB');
              
            }else if(FPB[1].classList.contains('active')){
              FPBA.previousElementSibling.classList.add('activeB');
              FPBA.nextElementSibling.classList.add('activeB');
              FPBA.nextElementSibling.nextElementSibling.classList.add('activeB');
              FPBA.nextElementSibling.nextElementSibling.nextElementSibling.classList.add('activeB');
              FPBA.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.classList.add('activeB');
              FPBA.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.classList.add('activeB');
            }else if(FPB[2].classList.contains('active')){
              FPBA.previousElementSibling.previousElementSibling.classList.add('activeB');
              FPBA.previousElementSibling.classList.add('activeB');
              FPBA.nextElementSibling.classList.add('activeB');
              FPBA.nextElementSibling.nextElementSibling.classList.add('activeB');
              FPBA.nextElementSibling.nextElementSibling.nextElementSibling.classList.add('activeB');
              FPBA.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.classList.add('activeB');
            }else if(FPB[FPB.length-3].classList.contains('active')){
              FPBA.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.classList.add('activeB');
              FPBA.previousElementSibling.previousElementSibling.previousElementSibling.classList.add('activeB');
              FPBA.previousElementSibling.previousElementSibling.classList.add('activeB');
              FPBA.previousElementSibling.classList.add('activeB');
              FPBA.nextElementSibling.classList.add('activeB');
              FPBA.nextElementSibling.nextElementSibling.classList.add('activeB');
            }
            else if(FPB[FPB.length-2].classList.contains('active')){
              FPBA.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.classList.add('activeB');
              FPBA.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.classList.add('activeB');
              FPBA.previousElementSibling.previousElementSibling.previousElementSibling.classList.add('activeB');
              FPBA.previousElementSibling.previousElementSibling.classList.add('activeB');
              FPBA.previousElementSibling.classList.add('activeB');
              FPBA.nextElementSibling.classList.add('activeB');
            }
            else if(FPB[FPB.length-1].classList.contains('active')){
              FPBA.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.classList.add('activeB');
              FPBA.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.classList.add('activeB');
              FPBA.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.classList.add('activeB');
              FPBA.previousElementSibling.previousElementSibling.previousElementSibling.classList.add('activeB');
              FPBA.previousElementSibling.previousElementSibling.classList.add('activeB');
              FPBA.previousElementSibling.classList.add('activeB');
            }else{
              FPBA.previousElementSibling.previousElementSibling.previousElementSibling.classList.add('activeB');
              FPBA.previousElementSibling.previousElementSibling.classList.add('activeB');
              FPBA.previousElementSibling.classList.add('activeB');
              FPBA.nextElementSibling.classList.add('activeB');
              FPBA.nextElementSibling.nextElementSibling.classList.add('activeB');
              FPBA.nextElementSibling.nextElementSibling.nextElementSibling.classList.add('activeB');
           
            }
            
          }else if (window.innerWidth < 768){
            console.log('<768');
            FPB.forEach(i => {
              i.classList.remove('activeB')
            });
            
            if(FPB[0].classList.contains('active')){
              FPBA.nextElementSibling.classList.add('activeB');
              FPBA.nextElementSibling.nextElementSibling.classList.add('activeB');
            }else if(FPB[FPB.length-1].classList.contains('active')){
              FPBA.previousElementSibling.previousElementSibling.classList.add('activeB');
              FPBA.previousElementSibling.classList.add('activeB');
            }else{
              FPBA.previousElementSibling.classList.add('activeB');
              FPBA.nextElementSibling.classList.add('activeB');
            }
          }
          else{
            console.log(window.innerWidth);
            console.log('>8>3');
            FPB.forEach(i => {
              i.classList.add('activeB')
            });
          }
      
        }
      }
      
      pagenumber()
      
      $(window).resize(function() {
        pagenumber()
      });
      
      $(function () {
        var len = 80;
         // 超過80個字以"..."取代
    
        $(".resultstext").each(function (i) {
          $(this).text().trim()
          console.log($(this).text().trim());
          if ($(this).text().length > len) {
    
            // $(this).attr("title", $(this).text());
            var text = $(this).text().trim().substring(0, len - 1) + "...";
            $(this).text(text);
          }
        });
        
       
      });

})()

