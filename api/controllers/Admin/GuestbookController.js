/**
 * Admin/guestbookController
 *
 */
module.exports = {
    index: function(req, res, next) {
        res.locals.headers = {
            'breadcrumb': [{
                name: "后台首页",
                link: "/admin/main"
            }],
            'title': '招聘列表',
            'description': "发布的招聘信息",
            'parent_purview': "content",
            'purview': "guestbook"
        };
        var current_page = req.query['p'] || req.query['page'] || 1;
        Pagination(Guestbook, {current_page: current_page},{sort:"id DESC"}).then(function(rs) {

            res.locals.data = rs.data;
            res.locals.paging = rs.paging;
            // return res.json(rs.paging);

            return res.view();
        }, function(err) {
            return next(err);
        });
    },
    add: function(req, res, next) {
        res.locals.headers = {
            'breadcrumb': [{
                name: "后台首页",
                link: "/admin/main"
            }],
            'title': '添加招聘',
            'description': "",
            'parent_purview': "content",
            'purview': "guestbook"
        };
        res.locals.guestbook = {};
        Category.getTree({
            model: "guestbook",
            lang: "zh_cn"
        }).then(function(data) {
            res.locals.categorys = data;

            if (req.method == "POST") {
                req.body.lang = "zh_cn";
                req.body.puttime = Util.unix(req.body.puttime);

                Guestbook.create(req.body).then(function(records) {
                    req.session.flash = {
                        succ: "添加成功!"
                    };
                    return res.redirect("/admin/guestbook/index");
                }, function(err) {
                    res.locals.flash = {
                        error: "添加失败!"
                    };
                    res.locals.guestbook = req.body;
                    return res.view();
                });
            } else {
                return res.view();
            }
        });
    },
    
    update: function(req, res, next) {
        var id = req.param("id");
        if (!id) {
            req.session.flash = {
                error: "资源未找到"
            };
            return res.redirect("back");
        }

        res.locals.headers = {
            'breadcrumb': [{
                name: "后台首页",
                link: "/admin/main"
            }],
            'title': '编辑招聘',
            'description': "",
            'parent_purview': "content",
            'purview': "guestbook"
        };
        res.locals.guestbook = {};
        Category.getTree({
            model: "guestbook",
            lang: "zh_cn"
        })
        .then(function(data){
            res.locals.categorys = data;

            return Guestbook.findOne({id:id});
        })
        .then(function(guestbook) {
            res.locals.guestbook = guestbook;

            if (req.method == "POST") {
                req.body.lang = "zh_cn";
                req.body.puttime = Util.unix(req.body.puttime);
                
                Guestbook.update({id:id},req.body).then(function(records) {
                    req.session.flash = {
                        succ: "更新成功!"
                    };
                    return res.redirect("/admin/guestbook/index");
                }, function(err) {
                    res.locals.flash = {
                        error: "更新失败!"
                    };
                    res.locals.guestbook = req.body;
                    return res.view();
                });
            } else {
                return res.view();
            }
        });
    },

    delete: function(req, res, next) {
        var id = req.param("id");
        if (!id) {
            req.session.flash = {
                error: "资源未找到"
            };
            return res.redirect("back");
        }
        Guestbook.destroy({
            id: id
        }).then(function(data) {
            if (data) {
                req.session.flash = {
                    succ: "删除成功"
                };
            } else {
                req.session.flash = {
                    error: "删除错误"
                };
            }
            return res.redirect("back");
        },function(err){
            return next(err);
        });
    }
};