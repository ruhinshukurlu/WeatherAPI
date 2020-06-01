$(document).ready(function () {

    $('.search').each(function () {
        var self = $(this);
        var div = self.children('div');
        var placeholder = div.children('input').attr('placeholder');
        var placeholderArr = placeholder.split(/ +/);
        if (placeholderArr.length) {
            var spans = $('<div />');
            $.each(placeholderArr, function (index, value) {
                spans.append($('<span />').html(value + '&nbsp;'));
            });
            div.append(spans);
        }
        self.click(function () {
            self.addClass('open');
            setTimeout(function () {
                self.find('input').focus();
            }, 750);
        });
        $(document).click(function (e) {
            if (!$(e.target).is(self) && !jQuery.contains(self[0], e.target)) {
                self.removeClass('open');
            }
        });
    });

    var icons = {
        'wind' : '<i class="fas fa-wind"></i>',
        'cloudy' : '<i class="fas fa-cloud"></i>',
        'clear-day' : '<i class="far fa-sun"></i>',
        'clear-night' : '<i class="far fa-moon"></i>',
        'rain' : '<i class="fas fa-cloud-showers-heavy"></i>',
        'snow' : '<i class="far fa-snowflake"></i>',
        'fog' : '<i class="fas fa-smog"></i>',
        'partly-cloudy-day' : '<i class="fas fa-cloud-sun"></i>',
        'partly-cloudy-night' : '<i class="fas fa-cloud-moon"></i>'
    }
    
    
    $('#search-input').on('keyup', function (e) {
        if (e.keyCode == 13) {
            $('.search').toggle();
            $('.container').toggle(1000);

            var city = $(this).val();

            $.ajax({
                'async' : true,
                'crossDomain' : true,
                'url' : `https://us1.locationiq.com/v1/search.php?key=87edc841f76204&q=${city}&format=json`,
                'method' : 'GET'
            }).done(function(response){
                var location_name = response[0].display_name;
                var city_lat = response[0].lat;
                var city_lon = response[0].lon;
                var proxy = 'https://cors-anywhere.herokuapp.com/';
                $.ajax({
                    'async' : true,
                    'crossDomain' : true,
                    'data' : {
                        'exclude' : 'hourly,flags',
                        // 'lang' : 'az'
                    },
                    'url' : proxy + `https://api.darksky.net/forecast/f1fda39a7fe27931d4d00a90d7cafe04/${city_lat},${city_lon}`,
                    'method' : 'GET',
                }).done(function(response){
                    console.log(response)
                    var current_date = new Date(response.currently.time*1000)
                    var week_day = moment(current_date).format('dddd');
                    var today = moment(current_date).format('ll')
                    var temprature = Math.floor((response.currently.temperature-32)/1.8);
                    var weather_summary = response.currently.summary;
                    var humidity = response.currently.humidity*100;
                    var wind_speed = response.currently.windSpeed;
                    var icon = response.currently.icon;
                    console.log(temprature,weather_summary);
                    $('.date-dayname').text(week_day);
                    $('.date-day').text(today);
                    $('.weather-temp').text(temprature+'°C');
                    $('.weather-desc').text(weather_summary);
                    $('.location').text(location_name)
                    $('.humidity-text').text(humidity+'%')
                    $('.wind-text').text(wind_speed+'km/h');
                    $('.weather-icon').html(icons[icon])
                    

                    var future_week_day;
                    for(var i=1; i<response.daily.data.length; i++){
                        var day_time = new Date(response.daily.data[i].time*1000)
                        future_week_day = moment(day_time).format('dddd');
                        future_week_day = future_week_day.slice(0,3);
                        
                        var min = Math.floor((response.daily.data[i].temperatureMin-32)/1.8);
                        var max = Math.floor((response.daily.data[i].temperatureMax-32)/1.8);
                        future_day_temp = Math.floor((min+max)/2);

                        var future_week_day_icon = response.daily.data[i].icon;

                        var li_block = $('.week-list').children()[i]
                        $(li_block).find('.day-name').text(future_week_day)
                        $(li_block).find('.day-temp').text(future_day_temp+'°C')
                        $(li_block).find('.day-icon').html(icons[future_week_day_icon])
                    }
                    
                    
                })
            })

        }
    })

    $('.location-button').click(function () {
        $('.search').toggle(500);
        $('.container').toggle(500);
    })

});
