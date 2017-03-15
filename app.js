var fs = require('fs');
var request = require("request");
var cheerio = require("cheerio");
var mkdirp = require('mkdirp');

var site = "https://www.baidu.com/";
var dir = ''

function makeDir(dirpath) {
    //创建目录
    mkdirp(dirpath, function(err) {
        if (err) {
            console.log(err);
        }
    });
}

function requestUrl(url, filetagname, resourceattr, filenamelen, dir) {
    request(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body);
            if (filetagname && resourceattr && filenamelen > 0) {
                $(filetagname).each(function() {
                    var src = $(this).attr(resourceattr);
                    if (src.indexOf('http://') < 0 && src.indexOf('https://') < 0 && src.indexOf('//') < 0) {
                        src = site + $(this).attr(resourceattr);
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
                    console.log('正在下载' + src);
                    download(src, dir, src.substring(p1, end) + src.substr(-filenamelen, filenamelen));
                    console.log('下载完成');
                });
            }
        }
    });
}

//下载方法
var download = function(url, dir, filename) {
    request.head(url, function(err, res, body) {
        request(url).pipe(fs.createWriteStream(dir + "/" + filename));
    });
};

makeDir('test/my');
requestUrl(site, 'img', 'src', 4, 'test/my');