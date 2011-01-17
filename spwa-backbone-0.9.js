/*
 * spwa-backbone
 * version 0.9 (01/17/11)
 * @requires Backbone.js (http://documentcloud.github.com/backbone)
 * @requires Underscore (http://documentcloud.github.com/underscore)
 * @requires jQuery (http://jquery.com)
 *
 * Copyright (c) 2011 James Brown
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
*/

$(function(){
	
	// Define our page object:
	window.page = Backbone.Model.extend({});
	
	// Define our collection of pages:
	window.sitepages = Backbone.Collection.extend({
		model: page
	});
	
	// Create a 'pages' object which contains a collection of page models:
	window.pages = new sitepages;	
	
	// Define our page view:
	window.pageView = Backbone.View.extend({
		 // Let's put each view into a div:
		 tagName			: "div"
		 // Setup a class for each view:
		,className			: "page"
		// This runs when a new view is made:
		,initialize: function(){
			
			// Keep render and close bound to 'this':
			_.bindAll(this, 'render', 'close');
			
			// When 'change' is called, let's render the view:
  			this.model.bind('change', this.render);
		
			// Setting the view into the model:
  			this.model.view = this;
			// Render out the view (page) to the screen:
			this.render();
		}
		
		// This function takes the html from the model, inserts into the view and renders it to the screen:
		,render: function() {
			$(this.el).html($(this.model.get('htmlTemplate')).html()).attr('id', this.model.get('id'));
			return this;
		}
	});
	
	// Define our site:
	window.site = Backbone.Controller.extend({
		
		 // Set the app to the page body:
		 el:		$('body')
		 
		 // This defines our routes and calls show when a route is encountered:
		,routes: {
					"!:pageName": 'show'
		},
		
		// Fire up when the site object is called.  We pass in a jQuery array of script objects:
		initialize: function(contentPages){
			
			// Loop over each object, define some attributes and push them into the 'pages' collection:
			contentPages.each(function(i, contentPage){
				var contentPage = $(contentPage);
				var page = {
					 id: 			contentPage.attr('id').split('-')[0]						 
					,htmlTemplate:	'#' + contentPage.attr('id')
				}
				pages.add(page);
			})
			
			// If there isn't a #!something set the site to 'home':
			if (window.Backbone.history.getFragment() == ''){
				this.show('home')
			}
		},
		// This funciton does the actual page 'switching'.  It pulls the model out of the
		// collection of pages.  Then if the view doesn't exist, it creates it, if it does
		// it loads it, then shows it in the body:
		show: function(pageName) {
			var page = pages.get(pageName);
			var view = (page.view) ? page.view : new pageView({model: page});
			$(this.el).html(view.el);
		}
	});
	
	// Fire up our applicaiton and pass in an array of script/html objects
	window.App = new site($('script[type=text/template]'));
	
	// Start hashtag tracking via Backbone:
	Backbone.history.start();
});