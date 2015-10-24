import localStorage from 'localStorage';

module.exports = {
  getAuthInfo() {
    let authInfo = localStorage.getItem('authInfo');
    return JSON.parse(authInfo);
  },


  login(fbData) {
    localStorage.clear();
    let authInfo = {loggedIn:true,fbData:fbData};
    localStorage.setItem('authInfo', JSON.stringify(authInfo));
  },

  logout() {
    let authInfo = JSON.parse(localStorage.getItem('authInfo'));
    authInfo.loggedIn = false;
    localStorage.setItem('authInfo', JSON.stringify(authInfo));
  },
}
