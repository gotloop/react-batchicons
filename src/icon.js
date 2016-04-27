var React = require('react');
var paths = require('paths.json');

var Icon = React.createClass({

    getDefaultProps: function() {
        return {
            name: 'warning',
            width: '1em',
            height: '1em',
            fill: 'currentColor'
        }
    },

    render: function() {
        var path = paths[this.props.name] || false;
        return (
            <svg {...this.props} dataId={'icon-'+this.props.name} viewBox="0 0 48 48">
                <path d={path} />
            </svg>
        )
    }

});

module.exports = Icon;