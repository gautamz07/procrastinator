$(function() {

    /* 
    BUGS :
       - e.which is not working :- isolate bug and check why. 

    TODO::
    	===============================================================================================
        - ADD a details task card just like on just reminder.
        - On click of the details card, Task details should show up
        - refactor code to have every() and see why forEach is not returning variable.
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
        - Use https://github.com/pazguille/voix for speech recognition or Make own library.
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
            task : task ,
            task_Id : generateTaskId()
        }

        // console.log(task);
        // dvar date = execOnlyCaptureGroups(/^(\d+)\/(\d+)\/(\d+)/g.exec(date_val)),
        var date = execOnlyCaptureGroups(/^(\d+)\/(\d+)\/(\d+) (\d+)\:(\d+)/g.exec(date_val)),
        only_Date = date_val.match(/^(\d+)\/(\d+)\/(\d+)/g)[0];
        only_Time = date_val.match(/(\d+)\:(\d+)/g)[0];
        timeDiffObj = differenceCurrentDateTime(date),
        diffInSecounds = (convertHoursToSecounds(timeDiffObj.hours) || 0) + (convertMinutesToSecounds(timeDiffObj.mins) || 0);
        


        // console.log(only_Time);
        // datetimeshowcase
        // time = date_val.match(/\d+\:\d+/g);
        // console.log(timeDiffObj);
        // console.log(diffInSecounds);
        objTaskDetails.notifyIn = diffInSecounds;
        objTaskDetails.hoursMins = timeDiffObj
        objTaskDetails.dateTime = {
            date : only_Date,
            time : only_Time
        }

        console.log(objTaskDetails);
        

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

    function generateTaskId() {
        var localStroge_Procrastinator_tasks = $.parseJSON(localStorage.getItem('localStroge_Procrastinator_tasks')) || [];
        return (!localStroge_Procrastinator_tasks.length) ? 1 : (localStroge_Procrastinator_tasks.length + 1); 
    }

    // console.log(generateTaskId());

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
            $('<li><span class="task-detail" title="'+  obj.task +'">'+ obj.task +'</span><a href="" data-task-id="'+ obj.task_Id +'" data-remodal-target="task-additional-details-popup">Task Details</a></li>').appendTo('.task-list-wrapper > .task-list');
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

    /* =============================== */
      /* WHEN CLICKED ON TASK DETAILS */
    /* =============================== */

    $(document).on('click' ,  '.task-list > li > a'  , function(){


        var localStroge_Procrastinator_tasks = $.parseJSON(localStorage.getItem('localStroge_Procrastinator_tasks')) || [],
        task_Id = parseInt($(this).data('task-id'));
        
        // console.log(task_Id);


        storeRelevantObj = localStroge_Procrastinator_tasks.find(function(e, i){
            // console.log(e);
            if (e.task_Id === task_Id) {
                /*var dateTime = e.dateTime.date + ' ' + e.dateTime.time + ':00';
                console.log(dateTime);
                setTimeout(function(){
                    $('.task-additional-details-popup #datetimeshowcase').data('date', dateTime).TimeCircles({
                        time : {
                            Days: { color : '#292E46'  },
                            Hours: { color : '#CF218C'  },
                            Minutes: { color : '#FFC803'  },  
                            Seconds: { color : '#93EB49'  }  
                        }, 
                        circle_bg_color: "#ccc"
                        }).start()
                },500);*/
                return e;
            }
        });

        console.log(storeRelevantObj);

        // console.log(storeRelevantObj);
        // $('.task-additional-details-popup #datetimeshowcase');
        // var datetime = only_Date + ' ' + only_Time + ':00';
        // $("#datetimeshowcase").data('date', datetime).TimeCircles().start();
       
        return false;

    });


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
