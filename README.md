# web-platform-for-IoT
## 总结
我在HEATZY完成了我的实习，HEATZY是一家开发温控智能家居的公司，开发的产品主要是控制暖气的小盒子，这个小盒子可远距离控制暖气，并根据调节模式达到节能的目的。
我的实习的主题是网页开发。主要内容是配合产品功能开发网页版本，实现对温控盒子的状态和定时设置。完成的工作分别有：利用html和css对网页前端进行设计和美化，利用javascript使网页更加动态，在Node.js环境下处理后端数据并渲染前端，再根据需要利用Http或者Websocket协议提交数据。
同时我也掌握了node.js环境下的express框架的应用，拥有了分析和处理编程问题的能力。
## 公司介绍
HEATZY公司是一家在中国创建的创业公司，由一群热爱新技术的法国人组成。 它专门生产连接电暖气的智能盒子和家庭自动化领域的软件开发。
该公司的目标是实现电加热器的智能远程控制，这可以最大限度地减少能源浪费，同时使用户的生活更轻松。
HEATZY将通过整合最新的技术，如编程，机器学习和与Google Home和Amazon Alexa的集成平台来发展技术。
该团队致力成为一家能够为客户提供智能服务并节约世界能源的公司。 所有这些都将促进家庭自动化的发展，并有助于保护环境。
## 功能构思
对产品的控制由主要的三个页面完成，还有其余页面进行辅助。
* 用户注册：新用户输入邮箱和密码进行注册，两次密码输入正确后，成功收到注册邮件表示注册成功，可进行登录；
* 用户登录：用户输入注册邮箱和密码进行登录，若密码忘记可按照步骤进行重置密码：点击忘记密码，在跳转页面内输入注册邮箱，点击邮件内的链接进行重置，然后再进行登录；
* 控制产品：根据用户产品数目进行判断：如果绑定产品数目为0，则跳转至下载页面，指引客户下载手机端app并进行绑定产品操作，若用户需要购买产品，点击页面下方链接跳转至官网，可进行购买；如果绑定产品数目大于0，页面分为两部分进行产品控制；
        A.单个产品控制;
        B.产品分组控制。
* 定时模式设定：点击相应按钮之后可设定每时段产品模式，每条代表一天，每条上分布48个时段，可根据需要进行设定。使产品按照预先设定工作，方便用户远程管理和提前配置。
## 页面展示
![](https://github.com/JoJoDU/web-platform-for-IoT/raw/master/image/页面构成.png)
* 欢迎页面(Welcome page)：此页面分为两个部分，注册和登录，登录部分设有忘记密码功能；

![](https://github.com/JoJoDU/web-platform-for-IoT/raw/master/image/欢迎页面.png)
* 重置密码(Reset password)：此页面在输入注册邮箱后，通过发送到邮箱的链接更改密码；

![](https://github.com/JoJoDU/web-platform-for-IoT/raw/master/image/重置密码.png)
* 向导页面(Bind product)：此页面是面向新用户，未购买产品或未绑定设备时，指引客户购买产品或下载APP绑定产品；

![](https://github.com/JoJoDU/web-platform-for-IoT/raw/master/image/下载.png)
* 控制产品(Control product&product group)：此页面是产品详情页，为展示所有产品和产品组，并对其进行控制；

![](https://github.com/JoJoDU/web-platform-for-IoT/raw/master/image/控制产品.png)<br>
     A. 单个产品控制
      
![](https://github.com/JoJoDU/web-platform-for-IoT/raw/master/image/单个产品.png)

     B. 分组控制
      
![](https://github.com/JoJoDU/web-platform-for-IoT/raw/master/image/产品组.png)

      需要首先经过建立分组才可进行统一控制，在完成分组后，可根据需要添加产品。<br>
      a. 新建分组
      
![](https://github.com/JoJoDU/web-platform-for-IoT/raw/master/image/新建分组.png)

      b. 添加产品
      
![](https://github.com/JoJoDU/web-platform-for-IoT/raw/master/image/添加产品.png)
* 设置定时(Schedule Page)：此页面用来分时段对产品未来一周的模式预设定。

![](https://github.com/JoJoDU/web-platform-for-IoT/raw/master/image/定时模式控制.png)
