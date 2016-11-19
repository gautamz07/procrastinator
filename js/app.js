$(function() {

    /* 
    BUGS :
       - e.which is not working :- isolate bug and check why. 

    TODO::
    	===============================================================================================
        - Use speed recognition for the "task" input feild
           - https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API 
        - Add a "Edit Task" and "Delete Task" Button.
        ================================================================================================
        
        // - Use localstorge 
        - Check Plugin which can help New users get a introduction to the Application
    	- Use https://github.com/T00rk/bootstrap-material-datetimepicker for timepicker.
    	     - on page load the a script should run to check localstorage and reshedule tasks.
        - Add function that countdowns the time.   
        - ADD Grunt and Node_modules. 

    FUTURE::-
        - Use https://github.com/pazguille/voix for speech recognition or make own library.
        - Use Sound API for notifications.
    	- Add code to open in new tab when browser is opened. 
    	  I.E. The tab with the app opens and then also a tab with an empty tab.
    	  The empty tab should be the default tab for user interaction. 
    */
    // alert('aap');

    // init datetimePicker

    // Utility functions
    function execOnlyCaptureGroups(arr) {
        if (arr.constructor === Array) {
            arr.shift()
            return arr;
        } else {
            return arr;
        }
    }

    function differenceCurrentDateTime(dateTimeArr) {
        var now = new Date(),
            then = new Date(dateTimeArr[0], dateTimeArr[1] - 1, dateTimeArr[2], dateTimeArr[3], dateTimeArr[4], 0),
            minsDiff = Math.floor((then.getTime() - now.getTime()) / 1000 / 60),
            hoursDiff = Math.floor(minsDiff / 60),
            minsDiff = minsDiff % 60;
            return diffTime = {
            	hours: hoursDiff,
            	mins: minsDiff  
            }

    }

    function convertHoursToSecounds(val) {
        return +({
        	 1: '3600000',
        	 2: '7200000',  
        	 3: '10800000',
        	 4: '14400000',
        	 5: '18000000',
        	 6: '21600000',
        	 7: '25200000',
        	 8: '28800000',
        	 9: '32400000',
        	10: '36000000',
        	11: '39600000',
        	12: '43200000',
        	13: '46800000',
        	14: '50400000',
        	15: '54000000',
        	16: '57600000',
        	17: '61200000',
        	18: '64800000',
        	19: '68400000',
        	20: '72000000',
        	21: '75600000',
        	22: '79200000',
        	23: '82800000',
        	24: '86400000'
        }[val]);
    }

    function convertMinutesToSecounds(val) {
        return +({
             1: '60000',
             2: '120000',
             3: '180000',
             4: '240000',
             5: '300000',
             6: '360000',
             7: '420000',
             8: '480000',
             9: '540000',
            10: '600000',
            11: '660000',
            12: '720000',
            13: '780000',
            14: '840000',
            15: '900000',
            16: '960000',
            17: '1020000',
            18: '1080000',
            19: '1140000',
            20: '1200000',
            21: '1260000',
            22: '1320000',
            23: '1380000',
            24: '1440000',
            25: '1500000',
            26: '1560000',
            27: '1620000',
            28: '1680000',
            29: '1740000',
            30: '1800000',
            31: '1860000',
            32: '1920000',
            33: '1980000',
            34: '2040000',
            35: '2100000',
            36: '2160000',
            37: '2220000',
            38: '2280000',
            39: '2340000',
            40: '2400000',
            41: '2460000',
            42: '2520000',
            43: '2580000',
            44: '2640000',
            45: '2700000',
            46: '2760000',
            47: '2820000',
            48: '2880000',
            49: '2940000',
            50: '3000000',
            51: '3060000',
            52: '3120000',
            53: '3180000',
            54: '3240000',
            55: '3300000',
            56: '3360000',
            57: '3420000',
            58: '3480000',
            59: '3540000',
            60: '3600000'
        }[val]);
    }


    Date.prototype.monthDays = function(){

        var date = new Date(this.getFullYear(), this.getMonth()+1, 0),
        currentMonthLastDate = (date.getFullYear() + '/' + (date.getMonth()+ 1) + '/' +  date.getDate());
        // console.log(date.getFullYear());
        // console.log(date.getMonth()+ 1);
        // console.log(date.getDate());

        return currentMonthLastDate;
    }


    $('.save-task').on('click', function() {

        var date_val = $('#datetimepicker').val(),
        task = $('#task').val(),
        objTaskDetails = {
            task : task 
        }

        // console.log(task);
        // dvar date = execOnlyCaptureGroups(/^(\d+)\/(\d+)\/(\d+)/g.exec(date_val)),
        var date = execOnlyCaptureGroups(/^(\d+)\/(\d+)\/(\d+) (\d+)\:(\d+)/g.exec(date_val)),
        timeDiffObj = differenceCurrentDateTime(date),
        diffInSecounds = (convertHoursToSecounds(timeDiffObj.hours) || 0) + (convertMinutesToSecounds(timeDiffObj.mins) || 0);
        // time = date_val.match(/\d+\:\d+/g);
        // console.log(timeDiffObj);
        // console.log(diffInSecounds);
        objTaskDetails.notifyIn = diffInSecounds;
        objTaskDetails.hoursMins = timeDiffObj
        

        remindMeMain(objTaskDetails);
        addToLocalStorage(objTaskDetails);
        // addToTaskList(objTaskDetails);
        return false;

    });

    $('#datetimepicker').datetimepicker({
        minDate: 0,
        maxDate: new Date().monthDays()
    });

    var localStroge_Procrastinator_tasks = $.parseJSON(localStorage.getItem('localStroge_Procrastinator_tasks')) || [];

    function addToLocalStorage(obj) {
        localStroge_Procrastinator_tasks.push(obj);
        localStorage.setItem('localStroge_Procrastinator_tasks', JSON.stringify(localStroge_Procrastinator_tasks));
    }

    function addLocalStorageTaskToTaskBoard() {
        localStroge_Procrastinator_tasks.forEach(function(i,e){
            remindMeMain(i);
        })
    }

    addLocalStorageTaskToTaskBoard();

    /*function remindMeMain(remindObj) {
        setTimeout(function() {
            sendNotification(remindObj.taskName);
        }, convertHoursToSecounds(parseInt(remindObj.time)));
    }*/

    function remindMeMain(objTaskDetails) {
        setTimeout(function() {
            sendNotification(objTaskDetails.task);
        }, objTaskDetails.notifyIn );
        addToTaskList(objTaskDetails);
    }


    function addToTaskList(obj) {
        // consol
        if (obj) {
            $('.task-list-wrapper').addClass('visible');    
            $('<li><span class="task-detail" title="'+  obj.task +'">'+ obj.task +'</span><span>'+ ((Math.floor(obj.hoursMins.hours / 24) > 0) ? Math.floor(obj.hoursMins.hours / 24) + 'd ' : '') + (obj.hoursMins.hours % 24) +':'+ obj.hoursMins.mins +'</span></li>').appendTo('.task-list-wrapper > .task-list');
        }
    }

    // addToTaskList();
    // notification = window.Notification || window.mozNotification || window.webkitNotification;

    // function sendNotification(msg) {
    //     if (window.Notification && Notification.permission !== "denied") {
    //         Notification.requestPermission(function(status) { // status is "granted", if accepted by user
    //             var n = new Notification('Your Scheduled task', {
    //                 body: msg,
    //                 icon: '<i class="fa fa-facebook"></i>' // Not working :(
    //             });
    //         });
    //     }
    // }

    function sendNotification(msg) {
        if (window.Notification && Notification.permission !== "denied") {
            Notification.requestPermission(function(status) { // status is "granted", if accepted by user
                var n = new Notification('Your Scheduled task', {
                    body: msg,
                    icon: '<i class="fa fa-facebook"></i>' // Not working :(
                });
            });
        }
    }

    $('.wave-round-anim').click(function(){
        $(this).addClass('active');
        // return false;
        setTimeout(function(){
            $(this).removeClass('active');
        }.bind(this),1000);
    });

    // })();

    /* window.onbeforeunload = confirmExit;
        function confirmExit() {
            return "You have attempted to leave this page. Are you sure?";
    }  */

    /*function convertHoursToSecounds(val) {
    	return +({
    		1 : '3600000',
    		2 : '7200000',
    		3 : '10800000'
    	}[val]);
    } */

});
