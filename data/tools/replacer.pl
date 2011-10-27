#!/usr/bin/perl

open FIN, "<".$ARGV[0];

my %causeMap;

while(<FIN>)
{
    chomp;
    split /;/;
    $causeMap{$_[0]} = $_[1];
}

$line = <STDIN>;
print $line;

while(<STDIN>)
{
    chomp;
    split /,/;
    if (exists $causeMap{$_[1]} && defined $causeMap{$_[1]})
    {
        print $_[0].",\"".$causeMap{$_[1]}."\",".$_[2].",".$_[3].",".$_[4]."\n";
    }
}

