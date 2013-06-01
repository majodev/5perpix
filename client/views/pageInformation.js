/**
 * returns the status of the meteor connection
 */
Template.pageInformationHolder.status = function () {
	return "Meteor Stats: connected=" + Meteor.status().connected + 
		" status=" + Meteor.status().status + 
		" retryCount=" + Meteor.status().retryCount + 
		" retryTime=" + Meteor.status().retryTime + 
		" reason=" + Meteor.status().reason;
};