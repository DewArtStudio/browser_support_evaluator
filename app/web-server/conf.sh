#!/bin/bash
./configure \
    --prefix=/etc/nginx  \
    --sbin-path=/usr/sbin/nginx \
    --modules-path=/usr/lib/nginx/modules \
    --conf-path=/etc/nginx/nginx.conf \
    --error-log-path=/var/log/nginx/error.log \
    --http-log-path=/var/log/nginx/access.log \
    --pid-path=/var/run/nginx.pid \
    --lock-path=/var/run/nginx.lock \
    --user=root \
    --with-http_realip_module \
    --with-http_sub_module  \
	--with-http_dav_module \
	--with-http_flv_module \
	--with-http_mp4_module\
    --with-http_secure_link_module \
    --with-http_v2_module \
    --with-threads \
    --with-stream \
    --with-compat \
&& make && make install



	
	 
	 
	

	 
 

