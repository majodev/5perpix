<h1>5perpix</h1>
5perpix is a prototype I made to demonstrate, that it's possible to build a data-driven collaborative drawing webapp purely in js. It's powered by the giant <a href="http://www.meteor.com">meteor.js</a> and some <a href="http://d3js.org/">d3.js</a> magic.

The application is currently live at <a href="http://5perpix.majodev.meteor.com">5perpix.majodev.meteor.com</a>.

<h2>Features</h2>
* drawing: SVGs are rendered using d3.js (I'll include a canvas drawing implementation in a future release). All successful changes to the color of a "pixel" are pushed to subscribed clients immediately. This is the basis for collaborative drawing.
* chatting: You can add messages to any picture. Inserts are immediately pushed to subscribed clients. Internally, messages are linked to a reference_collection, that links to other objects (this example currently links messages over a message_reference to pictures only.)
* user-authentication: You have to be signed in to make ANY changes (submitting messages or updating pixels is else denied).

<h2>Structure</h2>
I tried to structure the whole project according to the <a href="https://github.com/oortcloud/unofficial-meteor-faq">unofficial meteor FAQ</a>. My background is in ActionScript3 and Java, so you might encounter some uncommon patterns (in the javascript world). Please, let me know if you find anything that doesn't make sense or is considered a bad practise!

<h2>Installation</h2>
Clone and use meteorite (mrt) to run this application and resolve its dependencies.
<pre>mrt</pre>

5perpix uses custom publish and subscribe rules. Hence, make sure to remove the autopublish meteor smart package!
<pre>mrt remove autopublish</pre>

I'm using Methor.methods to define allowed client interactions. These methods are declared in lib/methods.js. All direct transactions from the client to the database (inserting, updating and removing) should be denied. To enforce this behaviour, make sure to remove the smart package insecure! 
<pre>mrt remove insecure</pre>

<h2>Copyright</h2>
MIT license - see LICENSE.md for further information -
(c) 2013 Mario Ranftl (<a href="http://www.majodev.com">majodev</a>).