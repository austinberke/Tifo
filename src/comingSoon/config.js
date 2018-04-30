'use strict';



var background ={

       //  CHOOSE ON OF THIS OPTION
       // OPTION : 'gradient' , 'image' , 'slideShow'

       type   : 'slideShow',



       //OPTION :'bg-color-one','bg-color-two','bg-color-three','bg-color-four'

       gradient  : 'bg-color-one',


       slideShow : {

             slides :

                    [
                      { src: 'https://images.pexels.com/photos/305831/pexels-photo-305831.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
                      { src: 'https://images.pexels.com/photos/207241/pexels-photo-207241.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
                    ],

                    overlay:'assets/css/overlays/06.png'

                 },

       image : {

           // choose image for background
          image_url : "https://images.pexels.com/photos/933967/pexels-photo-933967.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"

        },

       //Option : ture ,false "activate or deactivate particle"
       particle : false

      } ;




/**************************
 **		countDwon      **
 **************************/

var counter = {


        // "counter-one", "counter-two","counter-three","counter-four"

		style : 'counter-four',

    launchDate : {


          // OPTIONS:"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"

          Month: 'January',


          //  DAY : INTEGER[ 1 - 31 ]

          Day: 17,


           // YEAR : INTEGER

          Year: 2020
    }

	};

/**************************
 **		Ajax Chimp       **
 **************************/

$("#subscribe_form").ajaxChimp({


	// Replace your mailchimp post url inside double quote "".

    url: "//novisdev.us15.list-manage.com/subscribe/post?u=202b79afea96f1d57561896f5&amp;id=02ba748be1"

  });
