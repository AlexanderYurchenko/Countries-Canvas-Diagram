document.addEventListener('DOMContentLoaded', function(){
  var canvasElem = document.getElementById('diag-large');
  var ctx = canvasElem.getContext("2d");
  var countryLists = document.querySelectorAll('.country_item');
  var welcomeText = document.querySelectorAll('.welcome_text');
  var mapContaner = document.querySelectorAll('.animated_map')[0];
  var listVote = document.querySelectorAll('.country_item a');
  var data = [
    {
      value: 30,
      color:"#cdcdcd"
    },
    {
      value: 30,
      color:"#cdcdcd"
    },
    {
      value: 30,
      color:"#cdcdcd"
    },
    {
      value: 30,
      color:"#cdcdcd"
    },
    {
      value: 30,
      color:"#cdcdcd"
    },
    {
      value: 30,
      color:"#cdcdcd"
    }
  ];
  var diagParams = [
      {
        country: 'Africa',
        iconWidth: 55
      },
      {
        country: 'Asia',
        iconWidth: 60
      },
      {
        country: 'Australia',
        iconWidth: 55
      },
      {
        country: 'Europe',
        iconWidth: 65
      },
      {
        country: 'North America',
        iconWidth: 70
      },
      {
        country: 'South America',
        iconWidth: 30
      }
    ];
  var options = {
    percentageInnerCutout : 79.5,
    animateRotate : false
  };
  var largeDiag = new Chart(ctx).Doughnut(data, options);

  var width = ctx.canvas.width,
  height = ctx.canvas.height,
  pi = Math.PI,
  startAngle,
  endAngle,
  radius = 305,
  doughNutWidth = 63,
  elemLeft = offsetPosition(canvasElem)[0],
  elemTop = offsetPosition(canvasElem)[1],
  activeSector = 0,
  prevActiveSector =0,
  highligtedSector,
  activeSectorFirst,
  sep1X1,
  sep1Y1,
  sep1X2,
  sep1Y2,
  iSector,
  carouselInt,
  carouselStarted = false,
  activeList,
  hoverStopped;

  function offsetPosition(element) {
    var offsetLeft = 0, offsetTop = 0;
    do {
        offsetLeft += element.offsetLeft;
        offsetTop  += element.offsetTop;
    } while (element = element.offsetParent);
    return [offsetLeft, offsetTop];
  };

  var doughnutRadius = height/2 - 5;
  var segmentAngle = 60/360 * (Math.PI*2);
  var sepStartAngles = [-90,-30,30,90,150,210];
  var sepEndAngles = [-30,30,90,150,210,270];

  var cutoutRadius = doughnutRadius * (options.percentageInnerCutout/100);
  var middleRadius = doughnutRadius-(doughnutRadius-cutoutRadius)/2;

  hoverHandler();
  mapContaner.addEventListener('mouseout', mouseOutFunction);
  var carouselStartInt = setTimeout(carouselStarter, 2000);
  //mapContaner.addEventListener('mouseover', hoverFunction);

  function drawSector(startAngle, endAngle, active) {
    startAngleRad = startAngle*Math.PI/180;
    endAngleRad = endAngle*Math.PI/180;
    sep1X1 = width/2 + Math.cos(startAngleRad)*(radius-doughNutWidth-4);
    sep1Y1 = height/2 + Math.sin(startAngleRad)*(radius-doughNutWidth-4);
    sep1X2 = width/2 + Math.cos(startAngleRad)*(radius-5);
    sep1Y2 = height/2 + Math.sin(startAngleRad)*(radius-5);

    sep2X1 = width/2 + Math.cos(endAngleRad)*(radius-doughNutWidth-4);
    sep2Y1 = height/2 + Math.sin(endAngleRad)*(radius-doughNutWidth-4);
    sep2X2 = width/2 + Math.cos(endAngleRad)*(radius-5);
    sep2Y2 = height/2 + Math.sin(endAngleRad)*(radius-5);

    ctx.restore();

    ctx.beginPath();
    ctx.arc(width/2, height/2, radius-doughNutWidth/2-4, startAngleRad, endAngleRad, false);
    ctx.lineWidth = doughNutWidth-4;
    if (active == 'active') {
      ctx.strokeStyle = "#ee9203";
    } else if (active == 'highlight'){
      ctx.strokeStyle = "#dad9d9";
      highligtedSector = activeSector;
    } else {
      ctx.strokeStyle = "#cdcdcd";
    };
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#fff";
    ctx.moveTo(sep1X1, sep1Y1);
    ctx.lineTo(sep1X2, sep1Y2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(sep2X1, sep2Y1);
    ctx.lineTo(sep2X2, sep2Y2);
    ctx.stroke();
  };

  function drawTextAlongArc(context, str, centerX, centerY, radius, angle, i, active){
    context.save();
    context.translate(centerX, centerY);
    var strLenght = angle * str.length;
    var iconAnleCorr = (Math.asin(diagParams[i].iconWidth/radius))/2-0.04;
    var iconWidth = diagParams[i].iconWidth;
    var spriteY;
    if (i == 2 || i == 3) {
      context.rotate(-pi);
      context.rotate(segmentAngle*i + segmentAngle/2);
      context.rotate(strLenght/2);
    } else {
      context.rotate(segmentAngle*i + segmentAngle/2);
      context.rotate(-strLenght/2);
    }

    if (active == 'active') {
      spriteY = 60;
      context.fillStyle = '#fff';
    } else if (active == 'highlight'){
      spriteY = 0;
      context.fillStyle = '#a2a2a2';
    } else {
      spriteY = 0;
      context.fillStyle = '#717171';
    };

    context.save();
    var resultAngle = (segmentAngle*i + segmentAngle/2) - (strLenght/2);
    var textIcon = new Image();

    textIcon.onload = function() {
      context.save();
      context.translate(width/2, height/2);
      context.rotate(segmentAngle*i + segmentAngle/2);
      if (i ==2 || i == 3) {
        context.rotate(pi);
        context.rotate(strLenght/2);
        context.rotate(0.04);
        context.translate(0, radius);
      } else {
        context.rotate(-strLenght/2);
        context.rotate(-0.04);
        context.translate(0, -1 * radius);
      };

      if (active == 'highlight') {
        context.globalAlpha = 0.5;
      };
      context.drawImage(textIcon, i*80, spriteY, 75, 60, -iconWidth/2, -28, 75, 60);
      context.restore();
    };
    textIcon.src = 'images/sprite.png';
    context.restore();
    if (i ==2 || i == 3) {
      context.rotate(-iconAnleCorr);
    } else {
      context.rotate(iconAnleCorr);
    };

    for (var n = 0; n < str.length; n++) {
      var char = str[n];
      if (i ==2 || i == 3) {
        context.rotate(-angle);
      } else {
        context.rotate(angle);
      };

      if (char == 'm' ||
          char == 'w' ){
        if (i ==2 || i == 3) {
          context.rotate(-angle/3);
        } else {
          context.rotate(angle/3);
        };
      };
      context.save();
      if (i ==2 || i == 3) {
        context.translate(0, radius);
      } else {
        context.translate(0, -1 * radius);
      };
      context.fillText(char, 0, 0);
      context.restore();
      if (char == 'm' ||
          char == 'w' ||
          char == 'A' ||
          char == 'N' ||
          char == 'E'){
        if (i ==2 || i == 3) {
          context.rotate(-angle/3);
        } else {
          context.rotate(angle/3);
        };
      };
    };
    context.restore();
  };

  function recoverCircle(doughnutRadius, cutoutRadius){
    ctx.save();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(width/2, height/2, doughnutRadius, 0, Math.PI*2, false);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(width/2, height/2, cutoutRadius, 0, Math.PI*2, false);
    ctx.stroke();
    ctx.restore();
  };

  mapContaner.addEventListener('click', function(event) {
    ctx.save();
    ctx.translate(width/2, height/2);

    var clickX = event.pageX - elemLeft - width/2,
        clickY = event.pageY - elemTop - height/2;
    var cursorAngle = Math.atan(clickY/clickX);

    if (clickX*clickX + clickY*clickY <= (radius)*(radius) && clickX*clickX + clickY*clickY >=(radius-doughNutWidth)*(radius-doughNutWidth)) {
      if (clickX > 0 && cursorAngle >= -pi/2 && cursorAngle <= -pi/6) {
        prevActiveSector = activeSector;
        activeSector = 0;
      } else if (clickX > 0 && cursorAngle >= -pi/6 && cursorAngle <= pi/6) {
        prevActiveSector = activeSector;
        activeSector = 1;
      } else if (clickX > 0 && cursorAngle >= pi/6 && cursorAngle <= pi/2) {
        prevActiveSector = activeSector;
        activeSector = 2;
      } else if (cursorAngle >= -pi/2 && cursorAngle <= -pi/6) {
        prevActiveSector = activeSector;
        activeSector = 3;
      } else if (cursorAngle >= -pi/6 && cursorAngle <= pi/6) {
        prevActiveSector = activeSector;
        activeSector = 4;
      } else {
        prevActiveSector = activeSector;
        activeSector = 5;
      };
      activeList = countryLists[activeSector];

      var cursorAngle = Math.atan(clickY/clickX);
      for(var i=0; i<countryLists.length; i++){
        countryLists[i].classList.remove('active');
      };
      if (!activeList.classList.contains('active')) {
        activeList.className = activeList.className + " active";
      };
      welcomeText[0].className = welcomeText[0].className + " hidden";

      if(activeSector != prevActiveSector || activeSector === highligtedSector){
        startAngle = sepStartAngles[prevActiveSector];
        endAngle = sepEndAngles[prevActiveSector];
        drawSector(startAngle, endAngle, false);
        drawTextAlongArc(ctx, diagParams[prevActiveSector].country, width/2, height/2, middleRadius, 0.045, prevActiveSector, false);

        highligtedSector = true;
        startAngle = sepStartAngles[activeSector];
        endAngle = sepEndAngles[activeSector];

        drawSector(startAngle, endAngle, 'active');
        drawTextAlongArc(ctx, diagParams[activeSector].country, width/2, height/2, middleRadius, 0.045, activeSector, 'active');
        recoverCircle(doughnutRadius, cutoutRadius);
      };
      hoverStopped = 1;
    };
    ctx.restore();
  }, false);

  function hoverHandler(){
    mapContaner.addEventListener('mousemove', hoverFunction);
  };

  function hoverFunction(event) {
    ctx.save();
    ctx.translate(width/2, height/2);
    var hoverX = event.pageX - elemLeft - width/2,
        hoverY = event.pageY - elemTop - height/2;
    if (hoverX*hoverX + hoverY*hoverY <= (radius)*(radius)) {
      clearInterval(carouselInt);
      carouselStarted = false;
      if(hoverStopped != 1){

        if (hoverX*hoverX + hoverY*hoverY <= (radius)*(radius) && hoverX*hoverX + hoverY*hoverY >=(radius-doughNutWidth)*(radius-doughNutWidth)) {
          var cursorAngle = Math.atan(hoverY/hoverX);
          if (hoverX > 0 && cursorAngle >= -pi/2 && cursorAngle <= -pi/6) {
            prevActiveSector = activeSector;
            activeSector = 0;
          } else if (hoverX > 0 && cursorAngle >= -pi/6 && cursorAngle <= pi/6) {
            prevActiveSector = activeSector;
            activeSector = 1;
          } else if (hoverX > 0 && cursorAngle >= pi/6 && cursorAngle <= pi/2) {
            prevActiveSector = activeSector;
            activeSector = 2;
          } else if (cursorAngle >= -pi/2 && cursorAngle <= -pi/6) {
            prevActiveSector = activeSector;
            activeSector = 3;
          } else if (cursorAngle >= -pi/6 && cursorAngle <= pi/6) {
            prevActiveSector = activeSector;
            activeSector = 4;
          } else {
            prevActiveSector = activeSector;
            activeSector = 5;
          };

          if(activeSector != prevActiveSector || activeSector === highligtedSector){
            startAngle = sepStartAngles[prevActiveSector];
            endAngle = sepEndAngles[prevActiveSector];
            drawSector(startAngle, endAngle, false);
            drawTextAlongArc(ctx, diagParams[prevActiveSector].country, width/2, height/2, middleRadius, 0.045, prevActiveSector, false);

            highligtedSector = true;
            startAngle = sepStartAngles[activeSector];
            endAngle = sepEndAngles[activeSector];

            drawSector(startAngle, endAngle, 'active');
            drawTextAlongArc(ctx, diagParams[activeSector].country, width/2, height/2, middleRadius, 0.045, activeSector, 'active');
            recoverCircle(doughnutRadius, cutoutRadius);
          };
          if(activeSector == 0 && prevActiveSector == 0 && activeSectorFirst != 1){
            activeSectorFirst = 1;
            highligtedSector = true;
            startAngle = sepStartAngles[activeSector];
            endAngle = sepEndAngles[activeSector];

            drawSector(startAngle, endAngle, 'active');
            drawTextAlongArc(ctx, diagParams[activeSector].country, width/2, height/2, middleRadius, 0.045, activeSector, 'active');
            recoverCircle(doughnutRadius, cutoutRadius);
          };
        };

      };

    } else if(carouselStarted == false){
      if(hoverStopped != 1){
        restoreCarousel();
        activeSectorFirst = 0;
        prevActiveSector = 0;
      };
    };
    ctx.restore();
  };

  function mouseOutFunction(event) {
    if(carouselStarted == false){
      if(hoverStopped != 1){
        restoreCarousel();
        activeSectorFirst = 0;
        prevActiveSector = 0;
      };
    };
  };

  function carousel(){
    drawSector(startAngle, endAngle, false);
    drawTextAlongArc(ctx, diagParams[activeSector].country, width/2, height/2, middleRadius, 0.045, activeSector, false);

    if(iSector == 5) {
      iSector = 0;
      startAngle = sepStartAngles[iSector];
      endAngle = sepEndAngles[iSector];
      activeSector = 0;
    } else {
      iSector++;
      startAngle = sepStartAngles[iSector];
      endAngle = sepEndAngles[iSector];
      activeSector++;
    };
    drawSector(startAngle, endAngle, 'highlight');
    drawTextAlongArc(ctx, diagParams[activeSector].country, width/2, height/2, middleRadius, 0.045, activeSector, 'highlight');
    recoverCircle(doughnutRadius, cutoutRadius);
  };

  function carouselStarter() {
    startAngle = sepStartAngles[0];
    endAngle = sepEndAngles[0];
    iSector = 0;
    activeSector = 0;
    carouselInt = setInterval(carousel, 1000);
    carouselStarted = true;
    clearTimeout(carouselStartInt);
  };

  function restoreCarousel() {
    startAngle = sepStartAngles[activeSector];
    endAngle = sepEndAngles[activeSector];
    drawSector(startAngle, endAngle, false);
    drawTextAlongArc(ctx, diagParams[activeSector].country, width/2, height/2, middleRadius, 0.045, activeSector, false);
    recoverCircle(doughnutRadius, cutoutRadius);
    carouselStarter();
  };

  var countries = [
  {name: 'Tunisia',
  value: 30},
  {name: 'Tanzania',
  value: 18},
  {name: 'South Africa',
  value: 16},
  {name: 'Namibia',
  value: 10},
  {name: 'Botswana',
  value: 8},
  {name: 'Zambia',
  value: 6},
  {name: 'Seventh',
  value: 3},
  {name: 'Eighth',
  value :2},
  {name: 'Ninth',
  value: 1},
  {name: 'Tenth',
  value :0.5}
  ];

  /*Small diagrams draw*/

  var diagSmall = document.querySelectorAll('.diag-small');

  for(var i=0; i<diagSmall.length; i++){
    var smallCtx = diagSmall[i].getContext("2d");
    var smallWidth = smallCtx.canvas.width,
    smallHeight = smallCtx.canvas.height,
    smallStartAngle = -pi/2,
    smallEndAngle,
    countryPercent = countries[i].value;

    smallEndAngle = -pi/2 +2*pi*countryPercent/100;

    smallCtx.arc(smallWidth/2, smallHeight/2, 42, smallStartAngle, smallEndAngle, false);
    smallCtx.lineWidth = 5;
    if(diagSmall[i].classList.contains('colored')) {
      smallCtx.strokeStyle = "#1d3a8d";
    } else {
      smallCtx.strokeStyle = "#f6bb0e";
    };
    smallCtx.stroke();
  };

  $('.vote_button').on('click', voteFunction);
  function voteFunction(){
    console.log('list index = '+$('.country_item li').index($('.country_item li.selected')));
    console.log('active sector = '+activeSector);

    var voteList = $('.votes ul li');

    for(i=0; i < voteList.length; i++) {
      var newI = i+1;
      $('.votes ul li:nth-child('+newI+')').find('.value').html(countries[i].value);
      $('.votes ul li:nth-child('+newI+')').find('.name span').html(countries[i].name);

    };
  };

  /*List marking*/
  var listClicked = $('.country_item ul li a');
  var listSingle = $('.country_item ul li');
  listClicked.click(function(event){
    listSingle.removeClass('selected')
    $(this).parents('li').addClass('selected');
    event.preventDefault();
  })
});