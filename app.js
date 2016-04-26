(function(){
   "use strict";

   var Enesehinnang = function(){

     // SEE ON SINGLETON PATTERN
     if(Enesehinnang.instance){
       return Enesehinnang.instance;
     }
     //this viitab Enesehinnang fn
     Enesehinnang.instance = this;

     this.routes = Enesehinnang.routes;
     // this.routes['home-view'].render()

     //console.log('moosipurgi sees');

     // KÕIK muuutujad, mida muudetakse ja on rakendusega seotud defineeritakse siin
     this.click_count = 0;
     this.currentRoute = null;
     //console.log(this);

     // hakkan hoidma kõiki purke
     this.ratings = [];

     // Kui tahan Moosipurgile referenci siis kasutan THIS = MOOSIPURGI RAKENDUS ISE
     this.init();
   };

   window.Enesehinnang = Enesehinnang; // Paneme muuutja külge

   Enesehinnang.routes = {
     'home-view': {
       'render': function(){
         // käivitame siis kui lehte laeme
         //console.log('>>>>avaleht');
       }
     },
     'list-view': {
       'render': function(){
         // käivitame siis kui lehte laeme
         //console.log('>>>>loend');

         //simulatsioon laeb kaua
         window.setTimeout(function(){
           document.querySelector('.loading').innerHTML = 'Laetud!';
         }, 3000);

       }
     },
     'manage-view': {
       'render': function(){
         // käivitame siis kui lehte laeme
       }
     }
   };

   // Kõik funktsioonid lähevad Moosipurgi külge
   Enesehinnang.prototype = {

     init: function(){
       console.log('Rakendus läks tööle!');

       //kuulan aadressirea vahetust
       window.addEventListener('hashchange', this.routeChange.bind(this));

       // kui aadressireal ei ole hashi siis lisan juurde
       if(!window.location.hash){
         window.location.hash = 'home-view';
         // routechange siin ei ole vaja sest käsitsi muutmine käivitab routechange event'i ikka
       }else{
         //esimesel käivitamisel vaatame urli üle ja uuendame menüüd
         this.routeChange();
       }

       //saan kätte purgid localStorage kui on
       if(localStorage.ratings){
           //võtan stringi ja teen tagasi objektideks
           this.ratings = JSON.parse(localStorage.ratings);
           console.log('Laadisin localStorageist massiivi ' + this.ratings.length);

           //tekitan loendi htmli
           this.ratings.forEach(function(jar){

               var new_jar = new Jar(jar.title, jar.context);

               var li = new_jar.createHtmlElement();
               document.querySelector('.list-of-ratings').appendChild(li);

           });

       }


       // esimene loogika oleks see, et kuulame hiireklikki nupul
       this.bindEvents();

     },

     bindEvents: function(){
       document.querySelector('.add-new-rating').addEventListener('click', this.addNewClick.bind(this));
       document.querySelector('.delete-rating').addEventListener('click', this.deleteClick.bind(this));
       document.querySelector('.modify-rating').addEventListener('click', this.modifyClick.bind(this));

       //kuulan trükkimist otsikastis
       //document.querySelector('#search').addEventListener('keyup', this.search.bind(this));

     },

     search: function(event){
         //otsikasti väärtus
         var needle = document.querySelector('#search').value.toLowerCase();
         //console.log(needle);

         var list = document.querySelectorAll('ul.list-of-ratings li');
         //console.log(list);

         for(var i = 0; i < list.length; i++){

             var li = list[i];

             // ühe listitemi sisu tekst
             var stack = li.querySelector('.content').innerHTML.toLowerCase();

             //kas otsisõna on sisus olemas
             if(stack.indexOf(needle) !== -1){
                 //olemas
                 li.style.display = 'list-item';

             }else{
                 //ei ole, index on -1, peidan
                 li.style.display = 'none';

             }

         }
     },

     addNewClick: function(event){
       //salvestame purgi
       //console.log(event);

       var title = document.querySelector('.title').value;
       var context = document.querySelector('.context').value;

       //console.log(title + ' ' + context);
       //1) tekitan uue Jar'i
       var new_jar = new Jar(title, context);

       //lisan massiiivi purgi
       this.ratings.push(new_jar);
       //console.log(JSON.stringify(this.ratings));
       // JSON'i stringina salvestan localStorage'isse
       localStorage.setItem('ratings', JSON.stringify(this.ratings));

       // 2) lisan selle htmli listi juurde
       var li = new_jar.createHtmlElement();
       document.querySelector('.list-of-ratings').appendChild(li);
       console.log("Uus element lisatud!");
       //console.log(this.ratings.length);

       var positiveCount = 0;
       var negativeCount = 0;
       for(var j = 0; j < this.ratings.length; ++j){
         if(this.ratings[j].title == "Positiivne" || this.ratings[j].title == "positiivne" || this.ratings[j].title == "Pos" || this.ratings[j].title == "pos" || this.ratings[j].title == "+"){
           positiveCount++;
         }if(this.ratings[j].title == "Negatiivne" || this.ratings[j].title == "negatiivne" || this.ratings[j].title == "Neg" || this.ratings[j].title == "neg" || this.ratings[j].title == "-"){
           negativeCount++;
         }
       }

       document.querySelector('#valueAmount').innerHTML = "Kokku on loenduris punkte: " + this.ratings.length;
       document.querySelector('#posValueAmount').innerHTML = "Positiivseid punkte: " + positiveCount;
       document.querySelector('#negValueAmount').innerHTML = "Negatiivseid punkte: " + negativeCount;
       if(positiveCount > negativeCount){
         document.querySelector('#valuation').innerHTML = "Olid tubli!";
       }else if(positiveCount == negativeCount){
         document.querySelector('#valuation').innerHTML = "Ei ole kõige hullem.";
       }else{
         document.querySelector('#valuation').innerHTML = "Oleks saanud paremini.";
       }

     },

     deleteClick: function(event){

       var json = localStorage.getItem("ratings");
       var json2 = JSON.parse(json);
       json2.pop();
       listOfratings.removeChild(listOfratings.lastChild);
       console.log("Viimane element kustutatud!");
       localStorage.setItem('ratings', JSON.stringify(json2));
       //localStorage.clear(); // See teeb terve localStorage tühjaks

       var positiveCount = 0;
       var negativeCount = 0;
       for(var j = 0; j < json2.length; ++j){
         if(json2[j].title == "Positiivne" || json2[j].title == "positiivne" || json2[j].title == "Pos" || json2[j].title == "pos" || json2[j].title == "+"){
           positiveCount++;
         }if(json2[j].title == "Negatiivne" || json2[j].title == "negatiivne" || json2[j].title == "Neg" || json2[j].title == "neg" || json2[j].title == "-"){
           negativeCount++;
         }
       }

       document.querySelector('#valueAmount').innerHTML = "Kokku on loenduris punkte: " + json2.length;
       document.querySelector('#posValueAmount').innerHTML = "Positiivseid punkte: " + positiveCount;
       document.querySelector('#negValueAmount').innerHTML = "Negatiivseid punkte: " + negativeCount;
       if(positiveCount > negativeCount){
         document.querySelector('#valuation').innerHTML = "Olid tubli!";
       }else if(positiveCount == negativeCount){
         document.querySelector('#valuation').innerHTML = "Ei ole kõige hullem.";
       }else{
         document.querySelector('#valuation').innerHTML = "Oleks saanud paremini.";
       }

     },

     modifyClick: function(event){
       var li_in_html = document.getElementById("listOfratings").lastElementChild;
       var title = document.querySelector('.title').value;
       var context = document.querySelector('.context').value;

       li_in_html.getElementsByClassName('content')[0].innerHTML = title + " | " + context;

       this.ratings[this.ratings.length-1].title = title;
       this.ratings[this.ratings.length-1].context = context;

       localStorage.setItem('ratings', JSON.stringify(this.ratings));
       console.log("Muutmine tehtud!");

     },

     routeChange: function(event){

       //kirjutan muuutujasse lehe nime, võtan maha #
       this.currentRoute = location.hash.slice(1);
       //console.log(this.currentRoute);

       //kas meil on selline leht olemas?
       if(this.routes[this.currentRoute]){

         //muudan menüü lingi aktiivseks
         this.updateMenu();

         this.routes[this.currentRoute].render();

       }else{
         /// 404 - ei olnud
       }


     },

     updateMenu: function() {
       //http://stackoverflow.com/questions/195951/change-an-elements-class-with-javascript
       //1) võtan maha aktiivse menüülingi kui on
       document.querySelector('.active-menu').className = document.querySelector('.active-menu').className.replace('active-menu', '');

       //2) lisan uuele juurde
       //console.log(location.hash);
       document.querySelector('.'+this.currentRoute).className += ' active-menu';

     }

   }; // MOOSIPURGI LÕPP

   var Jar = function(new_title, new_context){
     this.title = new_title;
     this.context = new_context;
     //console.log('created new rating');
   };

   Jar.prototype = {
     createHtmlElement: function(){

       // võttes title ja context ->
       /*
       li
        span.letter
          M <- title esimene täht
        span.content
          title | context
       */

       var li = document.createElement('li');

       var span = document.createElement('span');
       span.className = 'letter';

       var letter = document.createTextNode(this.title.charAt(0));
       if(this.title.charAt(0) == "P" || this.title.charAt(0) == "p" || this.title.charAt(0) == "+"){
         //console.log("green");
         span.style.color = "#1FCF3F";
         span.style.borderColor = "#1FCF3F";
       }else if(this.title.charAt(0) == "N" || this.title.charAt(0) == "n" || this.title.charAt(0) == "-"){
         //console.log("red");
         span.style.color =  "#F50C33";
         span.style.borderColor =  "#F50C33";
       }
       span.appendChild(letter);

       li.appendChild(span);

       var span_with_content = document.createElement('span');
       span_with_content.className = 'content';

       var content = document.createTextNode(this.title + ' | ' + this.context);
       span_with_content.appendChild(content);

       li.appendChild(span_with_content);

       return li;

     }
   };

   // kui leht laetud käivitan Moosipurgi rakenduse
   window.onload = function(){
     var app = new Enesehinnang();
   };

})();
