function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
        // Logged into your app and Facebook.
        //testAPI();
    } else {
        // The person is not logged into your app or we are unable to tell.
        document.getElementById('status').innerHTML = 'Please log ' +
            'into this app.';
    }
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
}

window.fbAsyncInit = function () {
    FB.init({
        appId: '311979432807070',
        cookie: true,
        xfbml: true,
        version: 'v3.2'
    });

    // Now that we've initialized the JavaScript SDK, we call 
    // FB.getLoginStatus().  This function gets the state of the
    // person visiting this page and can return one of three states to
    // the callback you provide.  They can be:
    //
    // 1. Logged into your app ('connected')
    // 2. Logged into Facebook, but not your app ('not_authorized')
    // 3. Not logged into Facebook and can't tell if they are logged into
    //    your app or not.
    //
    // These three cases are handled in the callback function.

    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
};

// Load the SDK asynchronously
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


$("#fb-login").click(function (){
    FB.login(function (response){
        if (response.status === 'connected') {
            FB.api('/me', 'GET', {
                "fields": "id,name"
            }, function (response) {
                //FB登入視窗點擊登入後，會將資訊回傳到此處。
                $("#id").text("id: " + response.id);
                $("#name").text("name: " + response.name);
                //資訊傳到這裡：
                $.post("http://luffy.ee.ncku.edu.tw:17785/api/login/facebook",{
                    name:response.name,
                    ID:response.id,
                },function(response){
                })
            });
        }
    }, {
            scope: 'public_profile,email,user_birthday', return_scopes: true
        });
});

$("#google-login").click(function(){
    $('#modaldiv').modal('show')

})

var profile
var id_token
function onSignIn(googleUser) {
  id_token = googleUser.getAuthResponse().id_token;
  console.log("ID Token: " + id_token);
 $.ajax({
      url:'http://luffy.ee.ncku.edu.tw:17785/api/login/google',
      method:'post',
      data:{
        token : id_token,
        },
      success:function(data){
      console.log(data)
      }
      })
}
