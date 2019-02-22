//Adds song lyrics to tag of class "update" and shows loader.  All variable and helper functions are kept out of global scope.
var updateText = document.getElementById('gif_entry').addEventListener('submit', function(){
  //This is the element to update with song lyrics to distract from the wait time
  var el = document.getElementsByClassName('update').item(0);

  //This causes the form to be hidden
  var elForm = document.getElementsByClassName('unhidden').item(0);
  elForm.className="gif_hidden";

  //This causes the loader gif to show
  var elLoader = document.getElementsByClassName('gif_hidden').item(0);
  elLoader.className="margin-added";

  //Fantasic music: "American Pie", "Gimme Shelter", "Hold On Loosely", "Don't Stop Believing", "Landslide", "Stairway to Heaven"
  var msg = [["A long long time ago...",
          "I can still remember how...",
          "That music used to make me smile.",
          "And I knew if I had my chance...",
          "That I could make those people dance...",
          "And maybe they'd be happy for a while.",
          "But February made me shiver...",
          "With every paper I'd deliver",
          "Bad news on the doorstep...",
          "I couldn't take one more step",
          "I can't remember if I cried...",
          "When I read about his widowed bride",
          "Something touched me deep inside...",
          "The day the music died",
          "So...Bye, bye Miss American Pie...",
          "Drove my Chevy to the levee but the levee was dry...",
          "And them good ole boys were drinking whiskey and rye...",
          "Singin' this'll be the day that I die...",
          "This'll be the day that I die"],

          ["Oh, a storm is threat'ning...",
          "My very life today...",
          "If I don't get some shelter...",
          "Oh yeah, I'm gonna fade away",
          "War, children, it's just a shot away...",
          "It's just a shot away",
          "War, children, it's just a shot away...",
          "It's just a shot away"],

          ["You see it all around you...",
          "Good lovin' gone bad",
          "And usually it's too late when you, realize what you had",
          "And my mind goes back to a girl I left some years ago...", 
          "Who told me...",
          "Just hold on loosely...",
          "But don't let go",
          "If you cling to tightly...",
          "You're gonna lose control",
          "Your baby needs someone to believe in...",
          "And a whole lot of space to breathe in"],

          ["Just a small town girl...",
           "Livin' in a lonely world",
           "She took the midnight train...",
           "Goin' anywhere",
           "Just a city boy...",
           "Born and raised in South Detroit",
           "He took the midnight train...",
           "Goin' anywhere"],

          ["Well, I've been afraid of changing...",
           "'Cause I've built my life around you",
           "But time made you bolder...",
           "Even children get older...",
           "And I'm getting older too",
           "I take my love, take it down",
           "I climb a mountain and turn around",
           "And if you see my reflection in the snow-covered hills...",
           "Will the landslide bring you down?"],

           ["There's a lady who's sure all that glitters is gold...",
           "And she's buying the stairway to heaven",
           "When she gets there she knows, if the stores are all closed...",
           "With a word she can get what she came for",
           "Ooh, ooh, and she's buying the stairway to heaven",
           "There's a sign on the wall but she wants to be sure...",
           "Cause you know sometimes words have two meanings",
           "In a tree by the brook, there's a songbird who sings...",
           "Sometimes all of our thoughts are misgiven"],

           ["We all came out to Montreux...",
           "On the Lake Geneva shoreline...",
           "To make records with a mobile...",
           "We didn't have much time",
           "Frank Zappa and the Mothers...",
           "Were at the best place around...",
           "But some stupid with a flare gun...",
           "Burned the place to the ground",
           "Smoke on the water, fire in the sky"],

           ["Just yesterday morning...", 
           "They let me know you were gone.",
           "Suzanne, the plans they made put an end to you.",
           "I walked out this morning and I wrote down this song...",
           "I just can't remember who to send it to.",
           "I've seen fire and I've seen rain.", 
           "I've seen sunny days that I thought would never end.",
           "I've seen lonely times when I could not find a friend...",
           "But I always thought that I'd see you again."],

           ["Well we know where we're goin'...",
           "But we don't know where we've been",
           "And we know what we're knowin'...",
           "But we can't say what we've seen",
           "And we're not little children...",
           "And we know what we want",
           "And the future is certain...",
           "Give us time to work it out",
           "We're on a road to nowhere...",
           "Come on inside",
           "Takin' that ride to nowhere...",
           "We'll take that ride"],
          
           ["I remember...",
           "The thirty-five sweet goodbyes...",
           "When you put me on the Wolverine up to Annandale",
           "It was still September...",
           "When your daddy was quite surprised...",
           "To find you with the working girls in the county jail",
           "I was smoking with the boys upstairs...",
           "When I heard about the whole affair...",
           "I said oh no William and Mary won't do",
           "Well I did not think the girl could be so cruel",
           "And I'm never going back...",
           "To my old school"]];

  //Introduction to song
  var intro = ["Sending out a confirmation email...",
               "Enjoy classic rock lyrics while we wait:"];

  //Make a random number between 0 and the number of songs minus 1 to select song
  var song = Math.floor(Math.random() * msg.length);

  //Delay of 2 to 3 seconds feels about right
  var delay = 2500;

  //Update tag element with new text
  var showMore = function(m){
    el.textContent = m;
  }

  //Update tag element with new class
  var changeClass = function(n){
    el.className = n;
  }

  //Add introduction to lyrics
  var lyrics = intro.concat(msg[song]);
  
  //Helper function makes a closure on j, so will bind to current value of i below instead of continuing to bind on i
  //Follows model of "The Good Parts" p39
  //Included change in styling for the song lyrics part of the message, not for the intro.
  var helperMsg = function(j) {
    return function() {
      showMore(lyrics[j]);
      if (j < intro.length){
        changeClass("update");
      }else{
        changeClass("update ital")
      }
    };
  };

  //Same trick: creating a closure on j
  var helperDelay = function(j) {
    return j * delay;
  };

  //Add timeouts to update it.  Uses for loop rather than for in so array elements are in correct order. "The Good Parts" p 60-1
  for (var i = 0; i < lyrics.length; i++) {
    //Create local variables inside for loop, so they will be in scope for setTimeout
    var callBack = helperMsg(i);
    var theDelay = helperDelay(i);
    setTimeout(callBack, theDelay);
  }
});


