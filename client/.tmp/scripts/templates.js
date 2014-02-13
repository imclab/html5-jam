this["JST"] = this["JST"] || {};

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