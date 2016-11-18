$(function () {
	

	/*  
		POTENTIAL BUGS:

		MINUTE BUG
		========================================
		where the settimeout is called like so:
		callSetTimeOut(obj2);
		Now suppose the setTimeout is called in 2 secounds and the current minute is already half way through, 
		could this create a problem later ? 

			POTENTIAL FIX:
			Since setTimeout uses seounds  use the Date.getSeounds() function and call the setTimeout at that particular Time.

		HOUR BUG:
		19:00 currently becomes 18:60 , the hour also needs to be checked and updated accordingly.	
		

	*/

	var CurrentTime = new Date(),
	CurrentTime = CurrentTime.getHours() + ':' + CurrentTime.getMinutes(),
	obj1_TimeStammp = CurrentTime.split(':'),
	obj1_TimeStammp = obj1_TimeStammp[0] + ':' + (parseInt(obj1_TimeStammp[1]) + 1),
	obj2_TimeStammp = CurrentTime.split(':'),
	obj2_TimeStammp = obj2_TimeStammp[0] + ':' + (parseInt(obj2_TimeStammp[1]) + 2);

	var obj1 = {
		task : 'Task Villian',
		TimeStamp : obj1_TimeStammp,
		callIn: 60000
	}


	var obj2 = {
		task : 'Task Hero',
		TimeStamp : obj2_TimeStammp,
		callIn: 120000
	}

	var TaskArray = [obj1 , obj2]


	function callSetTimeOut(obj) {	
		setTimeout(function(){

			// console.log(obj.task);

			var CurrentTime = new Date();
			CurrentTime = CurrentTime.getHours() + ':' + CurrentTime.getMinutes(),
			msgObj = null;			

			TaskArray.forEach(function(i , e){ 

				if (i.TimeStamp === CurrentTime) msgObj = i;

			})

			console.log(msgObj.task || 'something failed miserably ! LOL ');


		},obj.callIn);
	}



	callSetTimeOut(obj1);
	callSetTimeOut(obj2);


	function convertHoursToSecounds(val) {
			return +({
				1 : '60000',     // One Mins
				2 : '120000',    // Two Mins
				3 : '180000'     // Three Mins
			}[val]);
	}

	function addMins(val) {
			return +({
				1 : '1000',     // One Mins
				2 : '2000',    // Two Mins
				3 : '3000'     // Three Mins
			}[val]);
	}

});