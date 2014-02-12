this["JST"] = this["JST"] || {};

this["JST"]["app/templates/production.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="sidebar"></div>\n<div class="recorder"></div>\n<div class="comments"></div>';

}
return __p
};

this["JST"]["app/templates/recorder.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="stageLight"></div>\n\n<video id="preview"></video>\n\n<div class="controls">\n    <div class="recbtn btn">Rec</div>\n    <div class="stopbtn btn">Stop</div>\n    <div class="playbtn btn">Play</div>\n</div>\n\n<div class="videos-container"></div>';

}
return __p
};

this["JST"]["app/templates/sidebar.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<p>Video List :</p>\n<div class="videos-list"></div>\n';

}
return __p
};

this["JST"]["app/templates/topbar.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="topbar">\n<div class="container">\n\t<img src="">\n\n\t<div class="username">' +
((__t = ( username )) == null ? '' : __t) +
'</div>\n\n\t<div class="newProjectBtn"></div>\n\t<div class="melodyBtn"></div>\n\t<div class="settingsBtn"></div>\n\t<div class="logoutBtn"></div>\n</div>\n</div>';

}
return __p
};

this["JST"]["app/templates/video_element.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<img class="thumb" src="' +
((__t = ( cover )) == null ? '' : __t) +
'" />\n<h1 class="username">' +
((__t = ( username )) == null ? '' : __t) +
'</h1>\n<p class="comment">' +
((__t = ( comment )) == null ? '' : __t) +
'</p>';

}
return __p
};