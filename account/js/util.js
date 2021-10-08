var api_path = 'https://dev.api.poofties.middlepot.com/v1/poofties-site';

//translation
var langCookie = "lang";
var translatable_elements = [];
var currentLang = 'en';

function changeTranslation(e){
	if(!e.id){ //if not autotranslating
		e = e || window.event;
		e = e.target || e.srcElement;
	}
	var lang = e.id;
	//get elements to translate
	for(var i = 0; i < translatable_elements.length; ++i){
        var oid = translatable_elements[i];
		var current = document.getElementById(oid+'_'+currentLang);
		if(current){
            var tid = oid+'_'+lang; //remove two last characters and append new language
            var candidate = document.getElementById(tid);
            if(candidate){
                current.style.display = 'none';
                candidate.style.display = 'inline-block';
            }
        }
	}
	//updates language
	currentLang = lang;
	setCookie(langCookie, currentLang);
}

function registerTranslatable(t){
    translatable_elements.push(t);
}

function autoTranslate(){
    var cookieLang = getCookie(langCookie);
	window.onload = function(){
		if(cookieLang && cookieLang !== 'en'){
			var e = document.getElementById(cookieLang);
			if(e){
				changeTranslation(e);
			}
		}
	}
}
