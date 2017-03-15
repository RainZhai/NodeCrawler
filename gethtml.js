var http = require('http')
var fs = require('fs');
var request = require("request");
var cheerio = require("cheerio");
var mkdirp = require('mkdirp');

var url = 'http://wandeme.com'
var dir = '';

function makeDir(dirpath) {
    mkdirp(dirpath, function(err) {
        if (err) {
            console.log(err);
        }
    });
}

function requestUrl(url, filename, filetagname, resourceattr, filenamelen, dir) {
    request(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body);
            $(filetagname).each(function() {
                var src = $(this).attr(resourceattr);
                if (src && src != 'undefined') {
                    if (src.indexOf('http://') < 0 && src.indexOf('https://') < 0 && src.indexOf('//') < 0) {
                        src = url + $(this).attr(resourceattr);
                    }
                    if (src.indexOf('//') == 0) {
                        src = "http:" + $(this).attr(resourceattr);
                    }
                    var p1 = src.lastIndexOf("/");
                    var p2 = src.indexOf("?");
                    if (p2 > 0) {
                        src = src.substring(0, p2);
                    }
                    var end = src.lastIndexOf(".");
                    var newattr = "." + src.substring(p1, end) + src.substr(-filenamelen, filenamelen);
                    $(this).attr(resourceattr, newattr);
                }
            });
            fs.writeFile(dir + filename, $.html(), function(err) {
                if (err) {
                    console.log('出现错误!')
                }
                console.log('已输出至html中')
            })
        }
    });
}



makeDir('test/my');
requestUrl(url, '/index.html', 'link', 'href', 4, 'test/my');

/*http.get(url, function(res) {
    var html = ''
    res.on('data', function(data) {
        html += data;
    })
    res.on('end', function() {
        // 将抓取的内容保存到本地文件中
        fs.writeFile(dir + 'index.html', html, function(err) {
            if (err) {
                console.log('出现错误!')
            }
            console.log('已输出至index.html中')
        })
    })
}).on('error', function(err) {
    console.log('错误信息：' + err)
})*/