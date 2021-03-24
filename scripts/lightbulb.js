var lightOn = true;
function changeModes()
{
  if(lightOn)
  {
    var count = document.getElementsByClassName("lightmode").length
    for(i = 0; i < count; i++)
    {
      var body = document.getElementsByClassName("lightmode")[0];
      body.classList.remove("lightmode");
      body.classList.add("darkmode");
    }
    lightOn = false;
  }
  else
  {
    var count = document.getElementsByClassName("darkmode").length
    for(i = 0; i < count; i++)
    {
      var body = document.getElementsByClassName("darkmode")[0];
      body.classList.remove("darkmode");
      body.classList.add("lightmode");
    }
    lightOn = true;
  }
}
