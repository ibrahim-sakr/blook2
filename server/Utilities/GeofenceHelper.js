"use strict";
/**
 * Helper for Geofencing basic functionaloity 
 * For more info about WKT (Well-Known Text) format please visit this link below
 * https://en.wikipedia.org/wiki/Well-known_text
 * For more info about GeoJson format please visit this link below
 * http://geojson.org/
 */

var Terraformer      = require("terraformer"),
 	TerraformerParse = require("terraformer-wkt-parser"),
 	util 		     = require("util");

var GeofenceHelper = function(){
	
	/**
	 * Point in Polygon finder
	 * @param  {String|wkt} polygon [WKT formatted polygon points coordinates]
	 * @param  {Array|wkt}  points  [WKT formatted Array of points coordinates]
	 * @return {Array}              [Array of points coordinates with the test boolean result]
	 */
	this.pip = function(polygon , points)
	{
		var polygon = this.makePolygon(polygon);
		var points = this.makePoints(points);

		return points.map(function(point){
			return [point.coordinates , polygon.contains(point)];
		});
	};

	/**
	 * Creates a Polygon object from wkt formatted string
	 * @param  {String|wkt} polygonCords 
	 * @return {Object}              
	 */
	this.makePolygon = function(polygonCords)
	{
		return TerraformerParse.parse("POLYGON" +polygonCords);
	};

	/**
	 * Creates an array of Point object/objects from wkt formatted array of points
	 * @param  {Array|wkt} points 
	 * @return {Array|Object}        
	 */
	this.makePoints = function(points)
	{
		if(util.isArray(points))
		{
			return points.map(function(point){
				return TerraformerParse.parse("POINT" + point);
			});
		}
		else
		{
			return TerraformerParse.parse("POINT " + points);
		}
	}	
};

module.exports = new GeofenceHelper();