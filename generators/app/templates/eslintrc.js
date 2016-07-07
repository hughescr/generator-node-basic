'use strict';

<% if(useFlow) {  %>module.exports.extends = '@hughescr/eslint-config-flow';<%  } %>
<% if(!useFlow) {  %>module.exports.extends = '@hughescr/eslint-config-default';<%  } %>
