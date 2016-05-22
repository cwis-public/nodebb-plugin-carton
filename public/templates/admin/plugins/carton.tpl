<form id="carton">
    <div class="row">
        <div class="col-lg-9">
            <div class="panel panel-primary">
                <div class="panel-heading">
                    <div class="panel-title">
                        Carton Plugin Settings
                    </div>
                </div>
                <div class="panel-body">
                    <div class="form-group">
                        <label class="control-label" for="anim_re">
                            Only allow Carton Rose and Carton Vert to users whose group match this regular expression:
                        </label>
                        <input type="text" class="form-control" data-key="anim_re" id="anim_re" placeholder=""></input>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-3">
            <div class="panel panel-primary">
                <div class="panel-heading">
                    Action Panel
                </div>
                <div class="panel-body">
                    <button type="button" class="btn btn-success form-control" accesskey="s" id="save">
                        <i class="fa fa-fw fa-save"></i> Save Settings
                    </button>
                </div>
            </div>
        </div>
    </div>
</form>
<script>
require(['settings'], function(settings) {
    settings.sync('carton', $('#carton'));
    $('#save').click( function (event) {
        settings.persist('carton', $('#carton'), function(){
            socket.emit('admin.settings.syncCarton', {}, function(err, data){
            // Refresh key.
            $key.val(data.key);
          });
        });
    });
});
</script>
