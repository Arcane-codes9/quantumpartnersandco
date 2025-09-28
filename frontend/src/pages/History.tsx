import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Download, 
  Filter, 
  Search, 
  Calendar,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const History = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const tradeHistory = [
    {
      id: 'TXN001',
      date: '2024-01-15',
      time: '14:30:25',
      pair: 'BTC/USD',
      type: 'Buy',
      amount: '0.25 BTC',
      price: '$45,200',
      total: '$11,300',
      fee: '$22.60',
      status: 'Completed',
      profit: '+$850',
      isProfit: true
    },
    {
      id: 'TXN002',
      date: '2024-01-15',
      time: '11:45:12',
      pair: 'ETH/USD',
      type: 'Sell',
      amount: '5.0 ETH',
      price: '$2,450',
      total: '$12,250',
      fee: '$24.50',
      status: 'Completed',
      profit: '+$325',
      isProfit: true
    },
    {
      id: 'TXN003',
      date: '2024-01-14',
      time: '16:20:45',
      pair: 'ADA/USD',
      type: 'Buy',
      amount: '2,500 ADA',
      price: '$0.42',
      total: '$1,050',
      fee: '$2.10',
      status: 'Completed',
      profit: '-$45',
      isProfit: false
    },
    {
      id: 'TXN004',
      date: '2024-01-14',
      time: '09:15:33',
      pair: 'DOT/USD',
      type: 'Sell',
      amount: '150 DOT',
      price: '$7.80',
      total: '$1,170',
      fee: '$2.34',
      status: 'Completed',
      profit: '+$180',
      isProfit: true
    },
    {
      id: 'TXN005',
      date: '2024-01-13',
      time: '13:55:18',
      pair: 'SOL/USD',
      type: 'Buy',
      amount: '25 SOL',
      price: '$98.50',
      total: '$2,462.50',
      fee: '$4.93',
      status: 'Completed',
      profit: '+$275',
      isProfit: true
    },
  ];

  const filteredHistory = tradeHistory.filter(trade => {
    const matchesSearch = trade.pair.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trade.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || trade.type.toLowerCase() === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalProfit = tradeHistory.reduce((sum, trade) => {
    const profit = parseFloat(trade.profit.replace(/[+$-]/g, ''));
    return sum + (trade.isProfit ? profit : -profit);
  }, 0);

  return (
    <div className="pt-16 min-h-screen bg-muted/30">
      {/* Header */}
      <section className="py-8 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center"
          >
            <div className="text-primary-foreground">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Trading {t('nav.history')}
              </h1>
              <p className="text-primary-foreground/80">
                View your complete trading history and performance analytics
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Calendar className="mr-2 h-4 w-4" />
                Date Range
              </Button>
              <Button variant="premium">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Summary Cards */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <Card className="bg-gradient-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Trades</p>
                    <p className="text-2xl font-bold text-foreground">{tradeHistory.length}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Profit/Loss</p>
                    <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-accent' : 'text-destructive'}`}>
                      {totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)}
                    </p>
                  </div>
                  {totalProfit >= 0 ? (
                    <ArrowUpRight className="h-8 w-8 text-accent" />
                  ) : (
                    <ArrowDownRight className="h-8 w-8 text-destructive" />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
                    <p className="text-2xl font-bold text-foreground">
                      {Math.round((tradeHistory.filter(t => t.isProfit).length / tradeHistory.length) * 100)}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Avg Trade Size</p>
                    <p className="text-2xl font-bold text-foreground">$6,446</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by trading pair or transaction ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full md:w-48">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Trades</SelectItem>
                      <SelectItem value="buy">Buy Orders</SelectItem>
                      <SelectItem value="sell">Sell Orders</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Trade History Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Trade History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Transaction ID</th>
                        <th className="text-left p-3">Date & Time</th>
                        <th className="text-left p-3">Pair</th>
                        <th className="text-left p-3">Type</th>
                        <th className="text-left p-3">Amount</th>
                        <th className="text-left p-3">Price</th>
                        <th className="text-left p-3">Total</th>
                        <th className="text-left p-3">P&L</th>
                        <th className="text-left p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredHistory.map((trade, index) => (
                        <motion.tr
                          key={trade.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                          className="border-b hover:bg-muted/50 transition-colors"
                        >
                          <td className="p-3">
                            <code className="text-sm bg-muted px-2 py-1 rounded">
                              {trade.id}
                            </code>
                          </td>
                          <td className="p-3">
                            <div>
                              <p className="text-sm font-medium">{trade.date}</p>
                              <p className="text-xs text-muted-foreground">{trade.time}</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="font-medium">{trade.pair}</span>
                          </td>
                          <td className="p-3">
                            <Badge variant={trade.type === 'Buy' ? 'default' : 'secondary'}>
                              {trade.type}
                            </Badge>
                          </td>
                          <td className="p-3">{trade.amount}</td>
                          <td className="p-3">{trade.price}</td>
                          <td className="p-3 font-medium">{trade.total}</td>
                          <td className="p-3">
                            <span className={`font-medium ${trade.isProfit ? 'text-accent' : 'text-destructive'}`}>
                              {trade.profit}
                            </span>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className="text-xs">
                              {trade.status}
                            </Badge>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default History;