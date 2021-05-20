function sleep(ms){ return new Promise(resolve => setTimeout(resolve, ms)); }
function clearCookies(){ window.localStorage.clear(); }

//clearCookies()

window.onload = function(){
  const currentPage = window.location.pathname
  if (currentPage == '/'){ indexAlerts() }
  else if (currentPage == '/leader'){ leaderAlerts(); }
  else if (currentPage == '/voice'){ voiceAlerts(); }
  else if (currentPage == '/siege'){ siegeAlerts(); }
  else if (currentPage == '/covid'){ covidAlerts(); }
};



async function indexAlerts(){
  // last update: 29.1.2021 15:55
  var cookiesAlertCOOKIE = 'cookies-alert-v-01'
  if(!localStorage.getItem(cookiesAlertCOOKIE)){
    halfmoon.initStickyAlert({
      title: `Cookies notice`,
      content: `
        <img src='../0/resources/wantacookie.jpg' class='w-225' /><br>
        <span class='font-weight-light'>Cookies are used here, but it's only so alerts don't bother you everytime you show your face around here</span>`,
      alertType: "alert-secondary", timeShown: 7500
    });
    localStorage.setItem(cookiesAlertCOOKIE, 'true');
  }
}
async function leaderAlerts(){
  // last update: 29.1.2021 15:55
  var tableSortingCOOKIE = 'alert-table-can-be-sorted-v-01'
  var usernameModalsCOOKIE = 'alert-table-name-can-be-clicked-v-01'

  if(!localStorage.getItem(tableSortingCOOKIE)){
    halfmoon.initStickyAlert({
      title: "Table is sortable!",
      content: 'Just click on the header and watch the magic happen',
      alertType: "alert-success", timeShown: 10000
    });
    localStorage.setItem(tableSortingCOOKIE, 'true');
  }
  await sleep(100)
  if(!localStorage.getItem(usernameModalsCOOKIE)){
    halfmoon.initStickyAlert({
      title: 'More Stats!',
      content: `Click on the username to see even more statistics.`,
      alertType: "alert-secondary", timeShown: 10000
    });
    localStorage.setItem(usernameModalsCOOKIE, 'true');
  }
}
async function voiceAlerts(){
  var newGraphsCOOKIE = 'new-graphs-v-01'
  if(!localStorage.getItem(newGraphsCOOKIE)){
    halfmoon.initStickyAlert({
      title: 'New Graphs',
      content: 'They are draggable, zoom-able, but most importantly they are now responsive so they <i>should</i> work on phones too!',
      alertType: "alert-success", timeShown: 15000
    });
    localStorage.setItem(newGraphsCOOKIE, 'true');
  }
}
async function siegeAlerts(){
  var siegeMoreStatsCOOKIE = 'more-siege-stats-v-02'
  if(!localStorage.getItem(siegeMoreStatsCOOKIE)){
    halfmoon.initStickyAlert({
      title: 'New Stats Page!',
      content: 'Click on the username and watch the magic happen',
      alertType: "alert-success", timeShown: 60000
    });
    localStorage.setItem(siegeMoreStatsCOOKIE, 'true');
  }
}
async function covidAlerts(){
  var covidStatsCOOKIE = 'covid-stats-v-01'
  if(!localStorage.getItem(covidStatsCOOKIE)){
    halfmoon.initStickyAlert({
      title: 'New Stuff!',
      content: `<span class="font-weight-light mr-5">If you don\'t see anything new, be sure to properly reload the page using</span><kbd>SHIFT</kbd>+<kbd>F5</kbd>`,
      alertType: "alert-success", timeShown: 15000
    });
    localStorage.setItem(covidStatsCOOKIE, 'true');
  }
}
