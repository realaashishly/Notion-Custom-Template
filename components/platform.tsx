"use client";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PlatformsAccounts() {
    const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
    const [selectedAccount, setSelectedAccount] = useState<string>("The Architect");
    const [accounts, setAccounts] = useState<string[]>(["The Architect"]);
    const [accountPlatforms, setAccountPlatforms] = useState<{ [key: string]: string[] }>({
        "The Architect": ["YouTube", "Instagram", "Threads", "X", "Facebook"],
    });
    const [isPlatformDialogOpen, setIsPlatformDialogOpen] = useState(false);
    const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);
    const [newAccountName, setNewAccountName] = useState("");
    const [newPlatformName, setNewPlatformName] = useState("");

    const handleAddNewPlatform = () => {
        if (newPlatformName && selectedAccount) {
            setAccountPlatforms((prev) => {
                const currentPlatforms = prev[selectedAccount] || [];
                if (!currentPlatforms.includes(newPlatformName)) {
                    return {
                        ...prev,
                        [selectedAccount]: [...currentPlatforms, newPlatformName],
                    };
                }
                return prev;
            });
            setNewPlatformName("");
            setIsPlatformDialogOpen(false);
        }
    };

    const handleAddNewAccount = () => {
        if (newAccountName) {
            setAccounts([...accounts, newAccountName]);
            setAccountPlatforms((prev) => ({
                ...prev,
                [newAccountName]: [],
            }));
            setNewAccountName("");
            setIsAccountDialogOpen(false);
            setSelectedAccount(newAccountName);
        }
    };

    const handlePlatformClick = (platform: string) => {
        setSelectedPlatform(platform);
    };

    const handleAccountClick = (account: string) => {
        setSelectedAccount(account);
    };

    return (
        <div className='bg-zinc-950 text-white min-h-screen'>
            <div className='max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8 p-6 mx-auto'>
                {/* Platforms Section */}
                <div>
                    <h2 className='text-xl tracking-[0.3em] font-normal mb-6 text-zinc-300'>
                        PLATFORMS
                    </h2>
                    <div className='border-l-2 border-zinc-700 pl-4'>
                        <h3 className='text-red-500 font-medium mb-4'>
                            Platforms
                        </h3>
                        <Separator className="bg-zinc-700" />
                        <div className='flex items-center space-x-2 my-2 text-zinc-400'>
                            <span>⬇</span>
                            <span>Gallery</span>
                        </div>

                        <Separator className='mb-6 bg-zinc-700' />

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                            {(accountPlatforms[selectedAccount] || []).map((platform) => (
                                <Card
                                    key={platform}
                                    onClick={() => handlePlatformClick(platform)}
                                    className={cn(
                                        "cursor-pointer bg-zinc-900 border-zinc-700 hover:bg-zinc-900/60 transition rounded-lg p-2",
                                        selectedPlatform === platform &&
                                            "ring-1 ring-red-600"
                                    )}
                                >
                                    <CardContent className='p-4'>
                                        <div className='flex items-center space-x-3 mb-2'>
                                            <div
                                                className={cn(
                                                    "w-4 h-4 rounded-full border-2 border-zinc-500 flex items-center justify-center",
                                                    selectedPlatform === platform &&
                                                        "border-red-600"
                                                )}
                                            >
                                                {selectedPlatform === platform && (
                                                    <div className='w-2 h-2 rounded-full bg-red-600'></div>
                                                )}
                                            </div>
                                            <span className='text-white text-sm font-medium'>
                                                {platform}
                                            </span>
                                        </div>
                                        <div className='text-sm text-zinc-400 flex items-center space-x-2'>
                                            <span>👤</span>
                                            <span>{selectedAccount}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            <div
                                onClick={() => setIsPlatformDialogOpen(true)}
                                className='bg-zinc-900 border border-zinc-700 hover:border-zinc-500 cursor-pointer rounded-lg flex items-center p-4'
                            >
                                <div className='text-zinc-500 hover:text-zinc-300'>
                                    + New page
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Accounts Section */}
                <div>
                    <h2 className='text-xl tracking-[0.3em] font-normal mb-6 text-zinc-300'>
                        ACCOUNTS
                    </h2>
                    <div className='border-l-2 border-zinc-700 pl-6'>
                        <h3 className='text-red-500 font-medium mb-4'>
                            Accounts
                        </h3>
                        <Separator className="bg-zinc-700" />
                        <div className='flex items-center space-x-2 my-2 text-zinc-400'>
                            <span>⊞</span>
                            <span>Gallery</span>
                        </div>
                        <Separator className='mb-6 bg-zinc-700' />

                        <div className='grid grid-cols-1 gap-4'>
                            {accounts.map((account) => (
                                <Card
                                    key={account}
                                    onClick={() => handleAccountClick(account)}
                                    className={cn(
                                        "cursor-pointer bg-zinc-800 border-zinc-700 hover:bg-zinc-700 transition rounded-lg p-1",
                                        selectedAccount === account && "ring-1 ring-red-600"
                                    )}
                                >
                                    <CardContent className='p-4'>
                                        <div className='flex items-center space-x-3 mb-3'>
                                            <div
                                                className={cn(
                                                    "w-4 h-4 rounded-full border-2 border-zinc-500 flex items-center justify-center",
                                                    selectedAccount === account && "border-red-600"
                                                )}
                                            >
                                                {selectedAccount === account && (
                                                    <div className='w-2 h-2 rounded-full bg-red-600'></div>
                                                )}
                                            </div>
                                            <span className='text-white font-medium'>
                                                {account}
                                            </span>
                                        </div>

                                        {/* Platform indicators */}
                                        <div className='grid grid-cols-3 gap-2 text-sm'>
                                            {(accountPlatforms[account] || []).map((platform) => (
                                                <div key={platform} className='flex items-center space-x-1'>
                                                    <div className='w-3 h-3 rounded-full border border-zinc-500 flex items-center justify-center'>
                                                        <div className='w-1.5 h-1.5 rounded-full bg-zinc-500'></div>
                                                    </div>
                                                    <span className='text-zinc-400 truncate'>
                                                        {platform}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            <Card
                                onClick={() => setIsAccountDialogOpen(true)}
                                className='bg-zinc-900 border border-zinc-700 hover:border-zinc-500 cursor-pointer rounded-lg'
                            >
                                <CardContent className='p-4 text-center text-zinc-500 hover:text-zinc-300'>
                                    + New page
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Platform Dialog */}
            <Dialog open={isPlatformDialogOpen} onOpenChange={setIsPlatformDialogOpen}>
                <DialogContent className="bg-zinc-900 text-white border-zinc-700">
                    <DialogHeader>
                        <DialogTitle>Add New Platform for {selectedAccount}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Input
                            value={newPlatformName}
                            onChange={(e) => setNewPlatformName(e.target.value)}
                            placeholder="Enter platform name"
                            className="bg-zinc-800 text-white border-zinc-700"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleAddNewPlatform();
                                }
                            }}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsPlatformDialogOpen(false)}
                            className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddNewPlatform}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={!newPlatformName.trim() || !selectedAccount}
                        >
                            Add
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Account Dialog */}
            <Dialog open={isAccountDialogOpen} onOpenChange={setIsAccountDialogOpen}>
                <DialogContent className="bg-zinc-900 text-white border-zinc-700">
                    <DialogHeader>
                        <DialogTitle>Add New Account</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Input
                            value={newAccountName}
                            onChange={(e) => setNewAccountName(e.target.value)}
                            placeholder="Enter account name"
                            className="bg-zinc-800 text-white border-zinc-700"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleAddNewAccount();
                                }
                            }}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsAccountDialogOpen(false)}
                            className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddNewAccount}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={!newAccountName.trim()}
                        >
                            Add
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}