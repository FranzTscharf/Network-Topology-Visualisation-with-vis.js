    var nodes = null;
    var edges = null;
    var network = null;

    var LENGTH_MAIN = 200,
        LENGTH_SERVER = 200,
        LENGTH_SUB = 200,
        WIDTH_SCALE = 0.8,
        GRAY = 'gray',
        BLACK = '#2B1B17';

    function drawLegend(){
        // legend
        var mynetwork = document.getElementById('mynetwork');
        var x = - mynetwork.clientWidth / 2 + 50;
        var y = - mynetwork.clientHeight / 2 + 50;
        var step = 70;
        nodes.push({id: 1000, x: x, y: y, label: 'Internet', group: 'internet', value: 1, fixed: true, physics:false});
        nodes.push({id: 1001, x: x, y: y + step, label: 'router', group: 'router', value: 1, fixed: true,  physics:false});
        nodes.push({id: 1002, x: x, y: y + 2 * step, label: 'Server', group: 'server', value: 1, fixed: true,  physics:false});
        nodes.push({id: 1003, x: x, y: y + 3 * step, label: 'Computer', group: 'desktop', value: 1, fixed: true,  physics:false});
        nodes.push({id: 1004, x: x, y: y + 4 * step, label: 'Smartphone', group: 'mobile', value: 1, fixed: true,  physics:false});   
    }
    // Called when the Visualization API is loaded.
    function draw() {
      // Create a data table with nodes.
      nodes = [];

      // Create a data table with links.
      edges = [];

      nodes.push({id: 1, label: 'Internet', group: 'internet', value: 10});
      edges.push({from: 2, to: 1, length: 200, width: WIDTH_SCALE, label: '0.63 mbps'});


      nodes.push({id: 2, label: '192.168.0.1', group: 'cloud', value: 10});
      nodes.push({id: 3, label: '192.168.0.2', group: 'edgeDevice', value: 8});
      nodes.push({id: 4, label: '192.168.0.3', group: 'edgeDevice', value: 6});
      edges.push({from: 2, to: 3, length: LENGTH_MAIN, width: WIDTH_SCALE, label: '0.71 mbps'});
      edges.push({from: 2, to: 4, length: LENGTH_MAIN, width: WIDTH_SCALE, label: '0.55 mbps'});

      nodes.push({id: 201, label: '192.168.0.201', group: 'edgeDevice', value: 1});
      edges.push({from: 2, to: 201, length: LENGTH_SUB, color: GRAY, width: WIDTH_SCALE});

      // group around 1
      nodes.push({id: 10, label: '192.168.0.10', group: 'subnet', value: 10});
      edges.push({from: 1, to: 10, length: LENGTH_SERVER, color: BLACK, width: WIDTH_SCALE, label: '0.92 mbps'});
      nodes.push({id: 11, label: '192.168.0.11', group: 'subnet', value: 7});
      edges.push({from: 1, to: 11, length: LENGTH_SERVER, color: BLACK, width: WIDTH_SCALE, label: '0.68 mbps'});
      nodes.push({id: 12, label: '192.168.0.12', group: 'subnet', value: 3});
      edges.push({from: 1, to: 12, length: LENGTH_SERVER, color: BLACK, width: WIDTH_SCALE, label: '0.3 mbps'});

      // create a network
      var container = document.getElementById('mynetwork');
      var data = {
        nodes: nodes,
        edges: edges
      };
      var options = {
        nodes: {
          scaling: {
            min: 16,
            max: 32
          }
        },
        edges: {
            color: BLACK,
            smooth: false
          },
        groups: {
            cloud: {
                shape: 'circularImage',
                image: './vendor/vis.js/img/mockfog/cloud.svg',
                size: 25,
                color:{background:"#fff",color:"#fff",border:"black"},
                font:{color:"#000", size: 12}
            },
          edgeDevice: {
              shape: 'circularImage',
              image: './vendor/vis.js/img/mockfog/edgeDevice.svg',
              height: 5,
              width: 5,
              color:{background:"#fff",color:"#fff",border:"black"},
              font:{color:"#000"}
          },
            router: {
                shape: 'circularImage',
                image: './vendor/vis.js/img/mockfog/router.svg',
                height: 5,
                width: 5,
                color:{background:"#fff",color:"#fff",border:"black"},
                font:{color:"#000"}
            },
            subnet: {
              shape: 'circularImage',
              image: './vendor/vis.js/img/mockfog/subnet.svg',
                size:25,
                color:{background:"#fff",color:"#fff",border:"black"},
                font:{color:"#000", size: 12}
          },
            internet: {
              shape: 'circularImage',
                size:41,
                shapeProperties:{useImageSize: true,useImageSize:10,size:0.7},
              image: './vendor/vis.js/img/mockfog/internet.svg',
              color:{background:"#fff",color:"#fff",border:"black"},
              font:{color:"#000"}
          }
        },
        manipulation: {
          addNode: function (data, callback) {
            // filling in the popup DOM elements
            document.getElementById('node-operation').innerHTML = "Add Node";
            editNode(data, clearNodePopUp, callback);
          },
          editNode: function (data, callback) {
            // filling in the popup DOM elements
            document.getElementById('node-operation').innerHTML = "Edit Node";
            editNode(data, cancelNodeEdit, callback);
          },
          addEdge: function (data, callback) {
            if (data.from == data.to) {
              var r = confirm("Do you want to connect the node to itself?");
              if (r != true) {
                callback(null);
                return;
              }
            }
            document.getElementById('edge-operation').innerHTML = "Add Edge";
            editEdgeWithoutDrag(data, callback);
          },
          editEdge: {
            editWithoutDrag: function(data, callback) {
              document.getElementById('edge-operation').innerHTML = "Edit Edge";
              editEdgeWithoutDrag(data,callback);
            }
          }
        }
      };
      network = new vis.Network(container, data, options);
    }

    function editNode(data, cancelAction, callback) {
      document.getElementById('node-label').value = data.label;
      document.getElementById('node-saveButton').onclick = saveNodeData.bind(this, data, callback);
      document.getElementById('node-cancelButton').onclick = cancelAction.bind(this, callback);
      document.getElementById('node-popUp').style.display = 'block';
    }

    // Callback passed as parameter is ignored
    function clearNodePopUp() {
      document.getElementById('node-saveButton').onclick = null;
      document.getElementById('node-cancelButton').onclick = null;
      document.getElementById('node-popUp').style.display = 'none';
    }

    function cancelNodeEdit(callback) {
      clearNodePopUp();
      callback(null);
    }

    function saveNodeData(data, callback) {
      data.label = document.getElementById('node-label').value;
      data.group = document.getElementById('node-type').value;
      data.value = '102';
      console.log(data.toString());
      clearNodePopUp();
      callback(data);
    }

    function editEdgeWithoutDrag(data, callback) {
      // filling in the popup DOM elements
      document.getElementById('edge-label').value = data.label;
      document.getElementById('edge-saveButton').onclick = saveEdgeData.bind(this, data, callback);
      document.getElementById('edge-cancelButton').onclick = cancelEdgeEdit.bind(this,callback);
      document.getElementById('edge-popUp').style.display = 'block';
    }

    function clearEdgePopUp() {
      document.getElementById('edge-saveButton').onclick = null;
      document.getElementById('edge-cancelButton').onclick = null;
      document.getElementById('edge-popUp').style.display = 'none';
    }

    function cancelEdgeEdit(callback) {
      clearEdgePopUp();
      callback(null);
    }

    function saveEdgeData(data, callback) {
      if (typeof data.to === 'object')
        data.to = data.to.id
      if (typeof data.from === 'object')
        data.from = data.from.id
      data.label = document.getElementById('edge-label').value;
      clearEdgePopUp();
      callback(data);
    }