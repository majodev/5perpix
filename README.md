<h1>5perpix</h1>
5perpix is a prototype I made to demonstrate reactivity while drawing on SVGs. It's powered by the giant <a href="http://www.meteor.com">meteor.js</a> and some <a href="http://d3js.org/">d3.js</a> magic.

The application is currently live at <a href="http://5perpix.majodev.meteor.com">5perpix.majodev.meteor.com</a>.

<h2>Features</h2>
* drawing: SVGs are rendered using d3.js (I'll include a canvas drawing implementation in a future release).
* chatting: Messages are linked to a messageReference, that can be linked to ny object (this example currently links them to pictures only.)
* user-authentication: You need to be signed up to make ANY changes (submitting messages or updating pixels is else denied).

<h2>Structure</h2>
I tried to structure the whole project according to the <a href="https://github.com/oortcloud/unofficial-meteor-faq">unofficial meteor FAQ</a>. My background is in ActionScript3 and Java, so you might encounter some uncommon patterns (in the javascript world). Please, let me know if you find anything that doesn't make sense or is considered a bad practise!

<h2>Installation</h2>
Clone and use meteorite (mrt) to run this application and resolve its dependencies.
<pre>mrt</pre>

5perpix uses custom publish and subscribe rules. Hence, make sure to remove the autopublish meteor smart package!
<pre>mrt remove autopublish</pre>

I'm using Methor.methods to declare any allowed client interactions. These methods are defined in lib/methods.js. All direct transactions from the client to the database (inserting, updating and removing) should be denied. To enforce this behaviour, make sure to remove the smart package insecure! 
<pre>mrt remove insecure</pre>

<h2>Copyright</h2>
MIT license - see LICENSE.md for further information -
(c) 2013 Mario Ranftl (<a href="http://www.majodev.com">majodev</a>).