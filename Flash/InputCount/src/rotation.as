package {//动态设置注册点
	import flash.display.DisplayObject;
	import flash.geom.Point;
	//import DynamicRegistration;
	import flash.display.MovieClip;
	import flash.events.MouseEvent;
	public class rotation {
		//需更改的注册点位置
		private var regpoint:Point;
		//更改注册点的显示对象
		private var target: DisplayObject;
		function rotation(target: DisplayObject,regpoint:Point) {
			this.target=target;
			this.regpoint=regpoint;
		}
		//设置显示对象的属性
		public function flush(prop:String,value:Number):void {
			var mc=this.target;
			//转换为全局坐标
			var A:Point=mc.localToGlobal(regpoint);
			mc[prop]+=value;
			//执行旋转等属性后，再重新计算全局坐标
			var B:Point=mc.localToGlobal(regpoint);
			//把注册点从B点移到A点
			mc.x-=B.x-A.x;
			mc.y-=B.y-A.y;
		}
		private function rota(e:MouseEvent):void {
			var mymc:MovieClip=e.currentTarget as MovieClip;
			mymc.addEventListener(MouseEvent.CLICK,myfun);
			
			function myfun(e:MouseEvent):void {
				var mypt:Point=new Point(e.currentTarget.mouseX,e.currentTarget.mouseY);
				var myname: rotation=new rotation(mymc,mypt);
				myname.flush("rotation",10);
			}
		}
	}
}


