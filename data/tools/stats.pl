#!/usr/bin/perl

$line = <STDIN>;

my %causes = ();
while(<STDIN>)
{
    chomp;
    if ($_ =~ /(.+),(".+"),([12]),(.+),([0-9]+)/)
    {
        $causes{$2} += $5;
    }
    else
    {
        print "Error\n";
    }

}

foreach $key (sort {$causes{$b} <=> $causes{$a} } keys %causes)
{
    print $key.";".$causes{$key}."\n";
}
