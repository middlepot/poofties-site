var api_path = 'https://api.poofties.club/v1/poofties-site';
var tfa_path = 'https://api.poofties.club/v1/tfa';

//email validation
function validateEmail(email) {
	const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

//translation
var langCookie = "lang";
var translatable_elements = [];
var currentLang = 'en';
var langEvent = new Event('TranslationLoaded');
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
	document.dispatchEvent(langEvent); //signifies translation has loaded
}

function getCurrentLanguage(){
	return currentLang;
}

function registerTranslatable(t){
    translatable_elements.push(t);
}

function autoTranslate(){
    var cookieLang = getCookie(langCookie);
	window.onload = function(){
		if(cookieLang){
			var e = document.getElementById(cookieLang);
			if(e){
				changeTranslation(e);
			}
		}
	}
}

//loading overlay
var pooftiesLoadingOverlay;
function showLoadingOverlay(){
	pooftiesLoadingOverlay = document.createElement('div');
	pooftiesLoadingOverlay.style.background = 'rgba(255, 255, 255, 0.3)';
	pooftiesLoadingOverlay.style.zIndex = 9999;
	pooftiesLoadingOverlay.style.position = 'fixed';
	pooftiesLoadingOverlay.style.top = 0;
	pooftiesLoadingOverlay.style.left = 0;
	pooftiesLoadingOverlay.style.right = 0;
	pooftiesLoadingOverlay.style.bottom = 0;
	pooftiesLoadingOverlay.style.width = '100%';
	pooftiesLoadingOverlay.style.height = '100%';
	document.body.insertBefore(pooftiesLoadingOverlay, document.body.firstChild);
}

function hideLoadingOverlay(){
	if(pooftiesLoadingOverlay)
		pooftiesLoadingOverlay.remove();
}

//check if is authenticated
var pooftiesAuthenticated = false;
var pooftiesPageRequiresAuthentication = false;
var pooftiesAwaitingAuthentication = false;
async function checkAuthentication(){
	
	if(pooftiesPageRequiresAuthentication && !pooftiesAwaitingAuthentication){
		if(!pooftiesAuthenticated){
			pooftiesAwaitingAuthentication = true;
			var res = await fetch(api_path+'/auth', {
				'method': 'GET',
				credentials: 'include',
				headers:{
					'Content-Type': 'application/json',
				}
			});
			if(!res.status || res.status !== 200){
				//set return cookie
				window.location = '/account/login.html?url_ret='+encodeURI(window.location.href);
				return;
			}
			//all ok
			pooftiesAuthenticated = true;
			clearInterval(pooftiesAuthenticationCheckInterval);
			pooftiesAwaitingAuthentication = false;
		}
	}
}
var pooftiesAuthenticationCheckInterval = setInterval(checkAuthentication, 100); //check authentication every 100ms
