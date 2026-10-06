"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import * as LucideIcons from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"

// 直接讀取本地 JSON (現階段使用)
import sidebarDataMock from "@/data/sidebar.json"

// 定義資料型別
type SubMenuItem = {
    id: string
    title: string
    url: string
}

type MenuItem = {
    id: string
    title: string
    url?: string
    icon: string
    children?: SubMenuItem[]
}

// 動態圖示渲染元件
const DynamicIcon = ({ name }: { name: string }) => {
    // @ts-ignore - 允許使用字串作為索引來抓取 Lucide 圖示
    const Icon = LucideIcons[name]
    return Icon ? <Icon className="w-4 h-4" /> : null
}

export function AppSidebar() {
    // 未來替換為 API 串接時，可啟用狀態管理與 useEffect：
    /*
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    useEffect(() => {
        // 假設未來 API 需要 JWT
        // fetch('https://api.seanhocode.com/v1/menu', {
        //     headers: { 'Authorization': `Bearer ${token}` }
        // })
        // .then(res => res.json())
        // .then(data => setMenuItems(data))
    }, [])
    */
    
    // 目前先使用直接匯入的 mock 資料
    const menuItems: MenuItem[] = sidebarDataMock

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-sm font-bold text-blue-600 mb-2">
                        seanhocode
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => {
                                // 判斷是否為樹狀節點 (有 children)
                                if (item.children && item.children.length > 0) {
                                    return (
                                        <Collapsible key={item.id} defaultOpen className="group/collapsible">
                                            <SidebarMenuItem>
                                                <SidebarMenuButton render={<CollapsibleTrigger />}>
                                                    <DynamicIcon name={item.icon} />
                                                    <span>{item.title}</span>
                                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                </SidebarMenuButton>
                                                <CollapsibleContent>
                                                    <SidebarMenuSub>
                                                        {item.children.map((subItem) => (
                                                            <SidebarMenuSubItem key={subItem.id}>
                                                                <SidebarMenuSubButton render={<Link href={subItem.url} />}>
                                                                    {subItem.title}
                                                                </SidebarMenuSubButton>
                                                            </SidebarMenuSubItem>
                                                        ))}
                                                    </SidebarMenuSub>
                                                </CollapsibleContent>
                                            </SidebarMenuItem>
                                        </Collapsible>
                                    )
                                }

                                // 單層節點
                                return (
                                    <SidebarMenuItem key={item.id}>
                                        <SidebarMenuButton render={<Link href={item.url || "#"} />}>
                                            <DynamicIcon name={item.icon} />
                                            <span>{item.title}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}