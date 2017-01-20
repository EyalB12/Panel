// Copyright (c) 2015 - 2016 Dane Everitt <dane@daneeveritt.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
$(document).ready(function () {
    $('.server-files').addClass('active');
    const Editor = ace.edit('editor');
    const Modelist = ace.require('ace/ext/modelist')

    Editor.setTheme('ace/theme/chrome');
    Editor.getSession().setMode(Modelist.getModeForPath(Pterodactyl.stat.name).mode);
    Editor.getSession().setUseWrapMode(true);
    Editor.setShowPrintMargin(false);

    Editor.commands.addCommand({
        name: 'save',
        bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
        exec: function(editor) {
            save();
        },
        readOnly: false
    });

    $('#save_file').on('click', function (e) {
        e.preventDefault();
        save();
    });

    function save() {
        var fileName = $('input[name="file"]').val();
        $('#save_file').html('<i class="fa fw-fw fa-spinner fa-spin"></i> Saving File').addClass('disabled');
        $.ajax({
            type: 'POST',
            url: Router.route('server.files.save', { server: Pterodactyl.server.uuidShort }),
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content'),
            },
            data: {
                file: fileName,
                contents: Editor.getValue()
            }
        }).done(function (data) {
            $.notify({
                message: 'File was successfully saved.'
            }, {
                type: 'success'
            });
        }).fail(function (jqXHR) {
            $.notify({
                message: jqXHR.responseText
            }, {
                type: 'danger'
            });
        }).always(function () {
            $('#save_file').html('<i class="fa fa-fw fa-save"></i> &nbsp;Save File').removeClass('disabled');
        });
    }
});