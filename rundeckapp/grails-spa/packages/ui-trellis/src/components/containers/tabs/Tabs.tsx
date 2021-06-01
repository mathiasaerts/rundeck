import Vue from 'vue'
import { VNode } from 'vue/types/umd'

import './tabs.scss'
import './tabs-standard.scss'
import './tabs-rounded.scss'

interface Tab {
    title: string
    active: boolean
    index: number
    keep: boolean
}

export default Vue.extend({
    name: 'rd-tabs',
    props: {
        type: {type: String, default: 'standard'},
        active: {type: Number, default: 0},
        label: {type: String, default: 'Tabs'},
    },
    created() {
        this.tabs = this.$slots.default?.filter(s => s.componentOptions) || []
        this.tabs.forEach((t, i) => t.key = i.toString())
        this.activeTab = this.active
    },
    data: () => ({
        tabs: [] as Array<VNode>,
        activeTab: 0
    }),
    methods: {
        handleSelect(tab: Tab) {
            this.activeTab = tab.index
        },
        handleKeypress(ev: KeyboardEvent, tab: Tab) {
            if (ev.code == 'Space')
                this.handleSelect(tab)
        }
    },
    render(h) {
        // TODO refactor
        const activeNode = (this.$slots.default?.filter(s => s.componentOptions) || [])[this.activeTab]
        const activeTab = activeNode.componentOptions?.propsData as any as Tab

        return (
            <div class={["rdtabs", `rdtabs--${this.type}`]}>
                <div class="rdtabs__tabheader">
                    
                    <div class={["rdtabs__tablist"]} role="tablist" aria-label={this.label}>
                        <div class={{
                            "rdtabs__leftendcap": true,
                            "rdtabs__tab": true,
                            "rdtabs__tab-previous": this.activeTab == 0
                        }}><div class="rdtabs__tab-inner"/></div>
                        {this.tabs.map( (node, i) => {
                            const tab = node.componentOptions?.propsData as any as Tab
                            return (
                                <div class={{
                                        "rdtabs__tab": true, 
                                        "rdtabs__tab--active": i == this.activeTab,
                                        "rdtabs__tab-previous": i == this.activeTab - 1
                                    }}
                                    role="tab" aria-selected={i == this.activeTab}
                                    key={tab.index}
                                    tabindex="0"
                                    vOn:click={() => {this.handleSelect(tab)}}
                                    vOn:keypress={(ev: KeyboardEvent) => {this.handleKeypress(ev, tab)}}>
                                        <div class="rdtabs__tab-inner">
                                            {tab.title}
                                        </div>
                                </div>
                            )
                        })}
                        <div class="rdtabs__rightendcap rdtabs__tab"><div class="rdtabs__tab-inner"/></div>
                    </div>
                    
                </div>
                <div class="rdtabs__pane" role="tabpanel">
                    {
                        activeTab.keep != false ?
                            <keep-alive>{activeNode}</keep-alive> :
                            activeNode
                    }
                </div>
            </div>
        )
    }
})
